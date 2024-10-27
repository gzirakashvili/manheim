
$(document).ready(function(){

    var token = $.ajax({
        url: 'https://accounts.tnet.ge/api/ka/user/auth',
        crossDomain: true,
        method: 'post',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        global: false,
        async: false,
        data: {
        'Email': mail,
        'Password': tpass,
        'FormToken': '4541da9617dbdedf595726e50dcf4f81bf8a740ef302ad49a67a64c6fb9b9e6f',
        'Continue': 'https://www.mymarket.ge/ka/'
        },
        success: function(response){
            return response;
        },
        error: function(response){
            console.log(response);
            return "0";
        }
    }).responseJSON;
    token = token.data.access_token;
    
    function post(car,car_model,year,cilindri,milage,driver_train,engine,vin_id,image){
        var json_data = {
            'type': 'car',
            'vehicle_type': 0,  /// მსუბუქი > 0 მძიმეტექნიკა > 1 მოტო > 2
            'currency_id': 3, 
            'category_id': 1, /// სედანი > 1 ჯიპი > 5 უნივერსალი > 3
            'man_id': car,
            'model_id': car_model,
            'car_model': '',
            'prod_year': year, /// gamoshvebis weli
            'car_run': milage,
            'car_run_dim': 6,
            'engine_volume': engine,
            'cylinders': cilindri,
            'gear_type_id': '3',
            'fuel_type_id': '0',
            'color_id': 16,
            'door_type_id': 2,
            'drive_type_id': driver_train,
            'price': '',
            'fb_share': 1,
            'first_deposit': '',
            'customs_passed': 'None',
            'has_catalyst': 1,
            'client_name': 'ლევანი',
            'client_phone': nomeri_tele,
            'phone_num': nomeri_tele,
            'codeId': 'undefined',
            'area_code': 500,
            'saloon_color_id': 16,
            'airbags': 12,
            'fuel_consumption_city': 0,
            'fuel_consumption_highway': 0,
            'fuel_consumption_combined': 0,
            'vin': '',
            'video_url': '',
            'car_desc_4': kommentari+" "+vin_id, /// აღწერა + ID
            'car_desc_1': kommentari+" "+vin_id, /// აღწერა + ID
            'car_desc_5': kommentari+" "+vin_id, /// აღწერა + ID
            'for_rent': null,
            'rent_daily': '0',
            'rent_purchase': '0',
            'rent_insured': '0',
            'rent_driver': '0',
            'right_wheel': 0,
            'has_turbo': 0,
            'location_id': 21,
            'tech_inspection': 'None',
            'license_number': '',
            'agreeInspectTerms': 'NaN',
            'inspected_in_greenway': 0,
            'PromBlockAutoUpdateQuantity': 0,
            'PromBlockColorQuantity': 0,
            'PromBlockVipQuantity': 0,
            'PromBlockAutoUpdateHour': 0,
            'PromBlockOrderValue': 0,
            'PromBlockColor': 0,
            'PromBlockAutoUpdate': 0,
            'PromBlockStickers': 0,
            'images': image,
            'saloon_material': 1,
            'comfort_features': [13,15,26,36,39,41,43,45,6,44,11,20,12,23,30,31,7,38,8,28,9,10,],
            'auction': null,
            'auction_end_dt_month': 'None',
            'period_in_days': 30,
            'change': null,
            'PayWithCard': 0,
        }
        $.ajax({
            url: 'https://api2.myauto.ge/ka/user/addProduct',
            crossDomain: true,
            headers: {"authtoken": token},
            global: false,
            async: false,
            method: 'post',
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            data: json_data,
            success: function(response){
                console.log(response);
            },
            error: function(response){
                console.error(response);
            }
        });
    }
    

    function detect_model(fullname){
        pname = fullname.toLowerCase();
        const fullnameARR = pname.split(" ");
        var model = "";
        var mark = "";
        var year = "";
        year = fullnameARR[0];
        fullnameARR.splice(0, 1);

        if (pname.includes("alfa romeo") || pname.includes("land rover")){
            var markAR = fullnameARR[0]+""+fullnameARR[1];
        }else{
            var markAR = fullnameARR[0];
        }

        for (const marks of data_myauto['data']['mans']) {
            if (marks.title.toLowerCase() == markAR.toLowerCase()){
                mark = marks.id;
                for (const models of data_myauto['data']['models']) {
                    if (pname.includes('amg ')){
                        pname = pname.replaceAll("3", "3amg")
                    }
                    if (models.manId == marks.id && mark != models.title.toLowerCase() && pname.replaceAll(' ','').includes(models.title.toLowerCase()) && model == ""){
                        model = models.id;
                    }
                }
            }
        }
        return year+" "+mark+" "+model;
    }
    
    function AlbumFromAWS(link){
        var image = "";
        var url = new URL(link);
        var urlParam = url.searchParams.getAll("disclosureid");

        $.ajax({
            url: 'https://cr-popout-api-prod.awsmandisclosure.manheim.com/report',
            crossDomain: true,
            headers: {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,ka;q=0.8,ka-GE;q=0.7',
            'priority': 'u=1, i',
            },
            global: false,
            async: false,    
            data: {
            'disclosureId': urlParam[0]
            },
            success: function(response){
                $.ajax({
                    url: 'https://api.fyuse.com/1.6/group/web/'+response.mediaAssets,
                    crossDomain: true,
                    data: {
                    'fy': '1'
                    },
                    global: false,
                    async: false,            
                    success: function(response){
                        try {
                            var interior = 0;
                            var exterior = 0;
                            var path = response.data.path;
                            response.data.list.forEach(element => {
                                if (element.type == "img"){
                                    if (element.category[0] == "exterior" && exterior < 7){
                                        image = image+""+path+""+element.path+",";
                                        exterior = exterior + 1;
                                    }
                                    if (element.category[0] == "interior" && interior < 7){
                                        image = image+""+path+""+element.path+",";
                                        interior = interior + 1;
                                    }
                                }
                            });
                        }catch(err) {
                        }
                    },
                    error: function(response){
                        console.error(response);
                    }
                });
            },
            error: function(response){
                console.error(response);
            }
        });
        return image;
    }

    function AlbumFromManheim(token_manheim, vin_code) {
        var image = "";
        var count = 0;

        $.ajax({
            url: 'https://api.manheim.com/listings/vin/'+vin_code,
            crossDomain: true,
            global: false,
            async: false,
            headers: {
                'accept': 'application/vnd.manheim.v10+json',
                'accept-language': 'en-US,en;q=0.9,ka;q=0.8,ka-GE;q=0.7',
                'authorization': 'Bearer '+token_manheim,
                'priority': 'u=1, i',
                'x-source-env': 'production'
            },
            contentType: 'application/vnd.manheim.v10+json',
            data: {
                'includeNotes': 'true', 
                'includeTestData': 'false'
            },
            success: function(response) {
                try {
                    response.items[0].images.forEach(data => {
                        if (count < 15){
                            image = image+""+data.largeUrl+",";
                            count = count + 1;
                        }
                    });
                }catch(err) {
                }
            },
            error: function(response){
                console.error(response);
            }
        });
        return image;
    }
    if (window.location.toString().indexOf("search.manheim.com") > -1) {
        $("body").append("<button id='startMoving' style='position: fixed;border:0px;z-index: 10000;bottom: 40px;right: 40px;text-align: center;background: transparent;'>"+svg+"</button>");

        $("#startMoving").click(function(){
            $('body').css('filter','blur(4px)');
            console.clear();

            var totalPRODCT = 0;
            var SearchResults = $('.SearchResultsDetailView__container');
            setTimeout(function(){
                SearchResults.each(function(index) {
                    var that = this;
                    var fullname = detect_model($(that).find('.ListingTitle__title').text()).split(" "); /// სრული სახელი
                    setTimeout(function(){
                        if (fullname.length === 3) {
                            var make = fullname[1]; ///  მარკა
                            var model = fullname[2]; /// მოდელი
                            var year = fullname[0]; ///  წელი
                            var odo = $(that).find('.OdometerInfo__container').text(); /// გარბენი მილში
                            odo = odo.replace(/[^\d.-]/g, '') * 1.609;
                            var driver_train = $(that).find('.DriveTrain__container').text(); /// წამყვანი თვლები
                            driver_train = driver_train.replace("RWD", "2").replace("FWD", "1").replace("AWD", "3").replace("4WD", "3").replace("•","")
                            var engine = $(that).find('.EngineInfo__displacement').text().replace("L","").replace(".","")+"00"; /// ძრავის მოცულობა
                            var cilindri = $(that).find('.EngineInfo__engine').text().replace(/[^\d.-]/g, '');
                            var vin_id = $(that).find('.Vin__container').text(); ///  VIN კოდი
                            var image = $(that).find('.VehicleImage__image').attr("src"); ///  პირველი ფოტო
                            var awslink = $(that).find('span.VehicleReportLink').children('span.Tracker__container').children('a').attr('href'); /// ლინკი AWS სერვერისთვის
                            var token_manheim = $(document).find('mcom-header').attr('token'); /// მანჰეიმის ავტორიზაციის ტოკენი

                            console.log("Starting "+$(that).find('.ListingTitle__title').text());

                            if (awslink.indexOf("disclosureid") > -1){
                                /// ************** ფოტოები რაღაც სერვერიდან
                                var awsimage = AlbumFromAWS(awslink);
                                if (awsimage != ""){
                                    image = awsimage;
                                }
                            }else{
                                /// ************** ფოტოები მანჰეიმის სერვერიდან
                                manheimimage = AlbumFromManheim(token_manheim,vin_id);
                                if (manheimimage != ""){
                                    image = manheimimage;
                                }
                            }

                            totalPRODCT++;
                            post(make,model,year,cilindri,odo,driver_train,engine,vin_id,image);
                        }else{
                            console.error("მოდელი ვერ მოიძებნა");
                        }
                    },1500 * (index + 1));
                });
            },1000);
            setTimeout(function(){
                confirm("წარმატებით გადავიდა "+totalPRODCT+" პროდუქტი");
                $('body').css('filter','0px');
            },1000 * 90);
        });
    }else{
        console.log("Not on manheim");
    }
});

