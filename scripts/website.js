
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
                if (response.statusCode == 1){
                    console.log(response);
                }else{
                    console.log(image);
                }
            },
            error: function(response){
                console.warn(response);
            }
        });
    }
    

    function detect_model(model,model2,mid){
        var model_id = false;

        /// MB
        if (mid == 25){
            if (model2.includes('AMG GT')){
                model2 = model2;
            }else if (model2.includes('AMG')){
                if (model2.includes(' GLA ')){
                    model2 = model2.replace("AMG ","").replace('GLA 45','gla45amg').replace('GLA 35','GLA 350');
                }else{
                    model2 = model2.replace("AMG ","").replace("3 S", "3").replace("3","3AMG");
                }
            }
        }
        /// BMW
        if (mid == 3){
            if (model.includes('Series')){
                model2 = model2.replace('xDrive','').replace('i','').replace('e','');
            }
        }
        /// Bently
        if (mid == 78) {
            model = model.replace("Continental GT",'Continental').replace(" EWB","");
            model2 = "";
        }
        /// Toyota
        if (mid == 41){
            model = model.replace("GR86",'GT86');
        }

        model = model.toLowerCase().replaceAll(" ","");
        model2 =  model2.toLowerCase().replaceAll(" ","");

        ///console.log(model,model2,mid);
        for (const models of data_myauto['data']['models']) {
            if (mid == 4) { /// დათასეთი > მოდელში
                if (models.manId == mid && model.includes(models.title.toLowerCase().replaceAll(" ",""))){
                    model_id = models.id;
                }
            }else if (mid == 23){ /// დათასეთი > თრიმ-მოდელში
                if (models.manId == mid && model2.includes(models.title.toLowerCase().replaceAll(" ",""))){
                    model_id = models.id;
                }
            }else{ ///
                if (models.manId == mid && (models.title.toLowerCase() == model || models.title.toLowerCase() == model2)){
                    model_id = models.id;
                }
            }

        }
        return model_id;
    }

    function detect_make(mname){
        var make = false;
        mname = mname.toLowerCase().replaceAll(" ","");

        for (const marks of data_myauto['data']['mans']) {
            if (marks.title.toLowerCase() == mname){
                make = marks.id;
                console.log(marks.title);
            }
        }
        return make;
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
                            var exterior = 0;
                            var path = response.data.path;
                            response.data.list.forEach(element => {
                                if (element.type == "img"){
                                    if (exterior < 7){
                                        image = image+""+path+""+element.path+",";
                                        exterior = exterior + 1;
                                    }
                                }
                            });
                        }catch(err) {
                        }
                    },
                    error: function(response){
                        console.warn(response);
                    }
                });
            },
            error: function(response){
                console.warn(response);
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
                        if (count < 7){
                            image = image+""+data.largeUrl+",";
                            count = count + 1;
                        }
                    });
                }catch(err) {
                }
            },
            error: function(response){
                console.warn(response);
            }
        });
        return image;
    }
    if (window.location.toString().indexOf("search.manheim.com") > -1) {

        setTimeout(function(){
            $("body").append("<button id='startMoving' style='position: fixed;border:0px;z-index: 10000;bottom: 40px;right: 40px;text-align: center;background: transparent;'>"+svg+"</button>");
            $('select[data-test-id="results-per-page-select"] option').remove();
            $('select[data-test-id="results-per-page-select"]').append('<option value="5">5</option>');
            $('select[data-test-id="results-per-page-select"]').append('<option value="10">10</option>');
            $('select[data-test-id="results-per-page-select"]').append('<option value="15">15</option>');
            $('select[data-test-id="results-per-page-select"]').append('<option value="20">20</option>');

            $("#startMoving").click(function(){
                console.clear();

                var totalPRODCT = 0;
                var SearchResults = $('.SearchResultsDetailView__container');
                SearchResults.each(function(index) {
                    var that = this;
                    var dataSET = JSON.parse($(that).find('.stockwave-vehicle-info').text());
                    var make = detect_make(dataSET.designatedDescriptionEnrichment.make); /// მარკა
                    var trim_model = dataSET.designatedDescriptionEnrichment.trim.toString(); /// მოდელი2
                    var model = detect_model(dataSET.designatedDescriptionEnrichment.model,trim_model,make); /// მოდელი
                    var year = dataSET.sourceYear; /// წელი
                    var odo = dataSET.odometer.toString(); /// გარბენი მილში 
                    odo = odo.replace(/[^\d.-]/g, '') * 1.609;
                    var driver_train = dataSET.driveTrain; /// წამყვანი თვლები 
                    driver_train = driver_train.replace("RWD", "2").replace("FWD", "1").replace("AWD", "3").replace("4WD", "3").replace("•","")
                    var engine = dataSET.engineDisplacement; if (engine != null) { engine = engine.replace("L","").replace(".","")+"00"; }else{ engine = '0' } /// ძრავის მოცულობა 
                    var cilindri = dataSET.engineType; if (cilindri != "Electric") { cilindri = cilindri.replace(/[^\d.-]/g, ''); }else{ cilindri = '0';} /// ცილინდრიები 
                    var vin_id = dataSET.vin; ///  VIN კოდი 
                    var image = ""; ///  პირველი ფოტო 
                    var awslink = $(that).find('span.VehicleReportLink').children('span.Tracker__container').children('a').attr('href'); /// ლინკი AWS სერვერისთვის
                    var token_manheim = $(document).find('mcom-header').attr('token'); /// მანჰეიმის ავტორიზაციის ტოკენი

                    console.log("Starting "+dataSET.designatedDescriptionEnrichment.make.toString()+" "+dataSET.designatedDescriptionEnrichment.model.toString()+" "+year.toString());
                    if (make != false && model != false) {
                        try {
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
                            /*
                            setTimeout(function(){
                                post(make,model,year,cilindri,odo,driver_train,engine,vin_id,image);
                            },1000 * (index + 1));
                            */
                            console.log(make,model,year,cilindri,odo,driver_train,engine,vin_id,image);
                        } catch (error) {
                        }
                    }else{
                        console.warn("მოდელი ვერ მოიძებნა");
                        console.log(dataSET);
                    }
                });
            });
        }, 6000);

    }else{
        console.log("Not on manheim");
    }
});

