$(document).ready(function(){

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

    function detect_model(model,mid){
        var model_id = false;
        
        for (const models of data_myauto['data']['models']) {
            if ((model_id == false) && model.toLowerCase().replaceAll(' ','').includes(models.title.toLowerCase()) && models.manId === mid){
                model_id = models.title;
            }
        }
        return model_id;
    }


    if (window.location.toString().indexOf("/lotSearchResults?") > -1) {
        $("body").append("<button class='startMoving' style='position: fixed;border:0px;z-index: 10000;bottom: 40px;right: 40px;text-align: center;background: transparent;'>"+svg+"</button>");
        ///$("body").append("<button class='startMoving' auto1 style='position: fixed;border:0px;z-index: 10000;bottom: 100px;right: 45px;text-align: center;background: transparent;'><img src='https://auto1-ge.preview-domain.com/assets/images/logo/logo_AUTO1.png' width='120'></button>");
        $('.startMoving').click(function(){
            var btn = $(this);
            console.clear();

            var SearchResults = $('tbody.p-element tr.p-element');
            SearchResults.each(function(index) {

                var id = $(this).find("span.search_result_lot_number.p-bold.blue-heading.ng-star-inserted").text().trim();
                var make, model, odo, year, driver_train, cilinder;
                var images = "";

                $.ajax({
                    url: 'https://www.copart.com/public/data/lotdetails/solr/lot-images/'+id,
                    crossDomain: true,
                    headers: {
                      'accept': 'application/json, text/plain, */*',
                      'accept-language': 'en-US,en;q=0.9,ka;q=0.8,ka-GE;q=0.7',
                      'access-control-allow-headers': 'Content-Type, X-XSRF-TOKEN',
                      'priority': 'u=1, i',
                    }
                  }).done(function(response) {

                    /// for AUTO1
                    title_name = response.data.lotDetails.ld;
                    driver_train = response.data.lotDetails.drv.toString();
                    if (driver_train.includes('Front-wheel')) {
                        driver_train_a1 = "წინა";
                    }else if ((driver_train.includes('4x4')) || driver_train.includes('All')){
                        driver_train_a1 = "4x4";
                    }else{
                        driver_train_a1 = "უკანა";
                    }
                    tranmsission = response.data.lotDetails.tsmn;
                    if (tranmsission == 'AUTOMATIC') {
                        tranmsission = "ავტომატიკა";
                    }else{
                        tranmsission = "მექანიკა";
                    }
                    color = response.data.lotDetails.clr;
                    color_inter = response.data.lotDetails.clr;
                    realvin = response.data.lotDetails.vf;
                    fuel_type = response.data.lotDetails.ft;
                    if (fuel_type.includes('GAS')) {
                        fuel_type = "ბენზინი";
                    }else if ((driver_train == 'DIESEL')){
                        fuel_type = "დიზელი";
                    }else if ((driver_train.includes('HYBRID'))){
                        fuel_type = "ჰიბრიდი";
                    }else{
                        fuel_type = "ელექტრო";
                    }
                    car_type = response.data.lotDetails.vehicleTypeCode;
                    if (car_type = 'VEHTYPE_V') {
                        car_type = "სედანი";
                    }else{
                        car_type = "ჯიპი";
                    }
                    make_a1 = response.data.lotDetails.mkn;
                    model_a1 = response.data.lotDetails.ld.replace(response.data.lotDetails.lcy,'').replace(response.data.lotDetails.mkn,'').trim().replaceAll(' ','');


                    make = response.data.lotDetails.mkn;
                    model = response.data.lotDetails.ld.replace(response.data.lotDetails.lcy,'').replace(response.data.lotDetails.mkn,'').trim().replaceAll(' ','');
                    
                    if (driver_train.includes('Front-wheel')) {
                        driver_train = 1;
                    }else if ((driver_train.includes('4x4')) || driver_train.includes('All')){
                        driver_train = 3;
                    }else{
                        driver_train = 2;
                    }
                    odo = response.data.lotDetails.orr * 1.609;
                    if (response.data.lotDetails.ft == 'ELECTRIC'){
                        engine = "0";
                        cilinder = "0";
                    }else{
                        engine = response.data.lotDetails.egn.split('L ')[0].replace('.','')+"00";
                        cilinder = response.data.lotDetails.egn.split('L ')[1].trim();
                    }
                    response.data.imagesList.IMAGE.forEach(element => {
                        images = images+""+element.highResUrl+",";
                    });
                    year = response.data.lotDetails.lcy.toString();
                    console.log("Starting "+make.toString()+" "+model.toString()+" "+year.toString());
                    make = detect_make(make);
                    model = detect_model(model, make);

                    console.log(make,model,engine,driver_train,cilinder,odo,id,images);
                    if ((make != false) && (model != false)){
                        id = "C"+id+"T";
                        ///post(make,model,year,cilinder,odo,driver_train,engine,id,images);
                        if (btn.attr('auto1') == ""){
                            post_a1(title_name,make_a1,model_a1,year,cilinder,odo,driver_train_a1,engine,id,images,tranmsission,color,color_inter,realvin,fuel_type,car_type,realvin);
                        }
                    }else{
                        console.warn("მოდელი ვერ მოიძებნა");
                    }
                  });
                  
            });

        });
    }
});