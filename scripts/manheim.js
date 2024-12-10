
$(document).ready(function(){

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
            }
        }
        return make;
    }

    
    function AlbumFromAWS(link, type = ""){
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
                                if (type == "A1") {
                                    if (element.category[0] != 'damages'){
                                        image = image+""+path+""+element.path+",";
                                    }
                                }else{
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

    function AlbumFromManheim(token_manheim, vin_code, type = "") {
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
                        if (type == "A1"){
                            image = image+""+data.largeUrl+",";
                    }else{
                            if (count < 7){
                                image = image+""+data.largeUrl+",";
                                count = count + 1;
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
        return image;
    }
    if (window.location.toString().indexOf("search.manheim.com") > -1) {

        setTimeout(function(){
            $("body").append("<button class='startMoving' style='position: fixed;border:0px;z-index: 10000;bottom: 40px;right: 40px;text-align: center;background: transparent;'>"+svg+"</button>");
            $("body").append("<button class='startMoving' auto1 style='position: fixed;border:0px;z-index: 10000;bottom: 100px;right: 45px;text-align: center;background: transparent;'><img src='https://auto1-ge.preview-domain.com/assets/images/logo/logo_AUTO1.png' width='120'></button>");
            $('select[data-test-id="results-per-page-select"] option').remove();
            $('select[data-test-id="results-per-page-select"]').append('<option value="5">5</option>');
            $('select[data-test-id="results-per-page-select"]').append('<option value="10">10</option>');
            $('select[data-test-id="results-per-page-select"]').append('<option value="15">15</option>');
            $('select[data-test-id="results-per-page-select"]').append('<option value="20">20</option>');

            $(".startMoving").click(function(){
                var btn = $(this);
                console.clear();

                var SearchResults = $('.SearchResultsDetailView__container');
                SearchResults.each(function(index) {
                    var that = this;
                    var dataSET = JSON.parse($(that).find('.stockwave-vehicle-info').text());
                    //// FOR AUTO1
                    var title_name = dataSET.designatedDescriptionEnrichment.manheimStandardDescription.shortDescription
                    var make_A1 = dataSET.designatedDescriptionEnrichment.make;
                    var model2_A1 = dataSET.sourceTrim.toString().replaceAll(" ", "");  /// მოდელი 2

                    if (make_A1.includes("Mercedes")){
                        var model_A1 = dataSET.designatedDescriptionEnrichment.trim.toString().replaceAll(" ", "");  /// მოდელი 1
                        if (model_A1.includes("AMG")){
                            model_A1 = model_A1.replace("AMG","").replace("3S","3")+"AMG"
                        }
                        if (model2_A1.includes('AMG GT')){
                            model_A1 = model2_A1;
                        }
                        if (model_A1 == 'AMGGT53'){
                            model_A1 = 'AMG53'
                        }
                        if (model_A1 == 'AMGS'){
                            model_A1 = 'AMGGTS'
                        }
                        if (model_A1 == 'AMGR'){
                            model_A1 = 'AMGGTR'
                        }
                        if (model_A1 == 'AMGC'){
                            model_A1 = 'AMGGTC'
                        }
                    }else{
                        var model_A1 = dataSET.designatedDescriptionEnrichment.model;  //// მოდელი 3
                    }

                    /// BMW
                    if (make_A1 == "BMW"){
                        if (model_A1.includes('Series')){
                            model_A1 = model2_A1.replace('xDrive','').replace('i','').replace('e','');
                        }
                    }
                    /// Ford
                    if (make_A1 == "Ford"){
                        if (model_A1[0] == 'F'){
                            model_A1 = model_A1.replace("-",'');
                        }
                    }
                    
                    /// Bently
                    if (make_A1 == "Bently") {
                        model_A1 = model_A1.replace("Continental GT",'Continental').replace(" EWB","");
                    }
                    /// Lexus
                    if (make_A1 == "Lexus") {
                        if (model_A1 != ""){
                            model_A1 = model2_A1.replace("FSPORT","").replace("Sport","").replace("Handling","").replace("Premium","").replace("Luxury+","").replace("Overtrail","").replace("+","");
                        }
                    }
                    /// Toyota
                    if (make_A1 == "Toyota"){
                        model_A1 = model_A1.replace("GR86",'GT86');
                    }

                    var driver_train_A1 = dataSET.driveTrain; /// წამყვანი თვლები 
                    driver_train_A1 = driver_train_A1.replace("RWD", "უკანა").replace("FWD", "წინა").replace("AWD", "4x4").replace("4WD", "4x4").replace("•","");
                    var color = dataSET.exteriorColor;
                    var color_inter = dataSET.interiorColor;
                    var id = dataSET.disclosureId;
                    var transmiss = dataSET.designatedDescriptionEnrichment.powertrain.transmission.type;
                    if (transmiss == "Automatic"){
                        transmiss = "ავტომატიკა";
                    }else{
                        transmiss = "მექანიკა";
                    }
                    var fuel_type = dataSET.engineFuelType;
                    if (fuel_type == "Gasoline"){
                        fuel_type = "ბენზინი";
                    }else if (fuel_type == "Electric"){
                        fuel_type = "ელექტრო";
                    }else if (fuel_type == "Diesel"){
                        fuel_type = "დიზელი";
                    }else{
                        fuel_type = "ჰიბრიდი";
                    }
                    var car_type = "სედანი";
                    if (dataSET.buyNowPrice != ""){
                        var price = dataSET.buyNowPrice;
                    }else{
                        var price = "0";
                    }

                    ////FOR MYAUTO
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
                            try {
                                if (awslink.indexOf("disclosureid") > -1){
                                    /// ************** ფოტოები რაღაც სერვერიდან
                                    var awsimage = AlbumFromAWS(awslink);
                                    var awsimageA1 = AlbumFromAWS(awslink,"A1");
                                    if (awsimage != ""){
                                        image = awsimage;
                                        imageA1 = awsimageA1;
                                    }
                                }else{
                                    /// ************** ფოტოები მანჰეიმის სერვერიდან
                                    manheimimage = AlbumFromManheim(token_manheim,vin_id);
                                    manheimimageA1 = AlbumFromManheim(token_manheim,vin_id,"A1");
                                    if (manheimimage != ""){
                                        image = manheimimage;
                                        imageA1 = manheimimageA1;
                                    }
                                }
                                if (btn.attr('auto1') == ""){
                                    post_a1(title_name,make_A1,model_A1,year,cilindri,odo,driver_train_A1,engine,id,imageA1,transmiss,color,color_inter,fuel_type,car_type,vin_id,price);
                                    console.log(title_name,make_A1,model_A1,imageA1);
                                }else{
                                    if (make != false && model != false) {
                                        setTimeout(function(){
                                            post(make,model,year,cilindri,odo,driver_train,engine,vin_id,image);
                                        },1000 * (index + 1));
                                        ///console.log(make,model,year,cilindri,odo,driver_train,engine,vin_id,image);

                                    }else{
                                        console.warn("მოდელი ვერ მოიძებნა");
                                        console.log(dataSET);
                                    }
                                }

                            } catch (error) {
                                console.log(error);
                            }

                });
            });
        }, 6000);

    }else{
        console.log("Not on manheim");
    }
});

