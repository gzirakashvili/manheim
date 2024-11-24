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

    function detect_model(text,mid){
        var model_id = false;
        text = text.replaceAll(' ', '');

        if (mid==25 && text.includes('3') && text.toLowerCase().includes('amg')){
            text = text.replace('AMG').replace('3','3AMG')
        }

        for (const models of data_myauto['data']['models']) {
            if (model_id == false && text.toLowerCase().includes(models.title.toLowerCase()) && models.manId === mid){
                model_id = models.id;
            }
        }
        return model_id;
    }


    if (window.location.toString().indexOf("/Search?") > -1) {
        $("body").append("<button id='startMoving' style='position: fixed;border:0px;z-index: 10000;bottom: 40px;right: 40px;text-align: center;background: transparent;'>"+svg+"</button>");
            $('#startMoving').click(function(){
                console.clear();

                var SearchResults = $('div.table-row-border');
                SearchResults.each(function(index) {
                    
                    var name = $(this).find('h4.heading-7 > a').text();
                    var year = name.split(" ")[0];
                    if (name.toLowerCase().includes('alfa romeo') || name.toLowerCase().includes('land rover')) {
                        var make = name.split(" ")[1]+" "+name.split(" ")[2];
                    }else{
                        var make = name.split(" ")[1];
                    }
                    var model = name.replace(year,"").replace(make,"").trim();
                    var id = "";
                    var engine = "0";
                    var cyl = "0";
                    var odo = "";
                    var driver_train = "";
                    var fueltype = "";
                    var images = "";
                    var images_link = $(this).find('img.img-responsive').attr('data-src');

                    var List_Item_Value = $(this).find('span.data-list__value');
                    List_Item_Value.each(function(index) {
                        var title = $(this).attr('title');
                        if (title != undefined && title.includes('Stock')){
                            id = $(this).text().trim();
                        }
                        if (title != undefined && title.includes('Fuel Type')){
                            fueltype = $(this).text().trim();
                        }
                        if (title != undefined && title.includes("Driveline Type")){
                            driver_train = $(this).text().trim();
                        }
                        if (fueltype != 'Electric' && title != undefined && title.includes('Cylinder')){
                            cyl = $(this).text().trim();
                        }
                        if (title != undefined && title.includes('Odometer')){
                            odo = $(this).text().trim();
                        }
                        if (fueltype != 'Electric' && title != undefined && title.includes('Engine')){
                            engine = $(this).text().trim();
                        }
                    });

                    if (id != "" || name != ""){

                        make = detect_make(make);
                        model = detect_model(model,make);
    
                        if (driver_train.includes('Rear')) { driver_train = '2'; }else if(driver_train.includes('All') || driver_train.includes('4')) { driver_train = '3'; } else { driver_train = '1'; }
                        odo = odo.replace(/\D/g,'').replace(',','').trim() * 1.609;
                        cyl = cyl.replace("Cyl","").trim();
                        engine = engine.split("L ")[0].replace('.',"")+"00";

                        for (let i = 1; i < 8; i++) {
                        images += images_link.replace('SID~I1',"SID~I"+i).replace("width=400",'width=845')+",";
                        }

                        console.log("Starting "+name.toString());
                        
                        if ((make != false) && (model != false)){
                            console.log(make,model,year,cyl,odo,driver_train,engine,id,images);
                            id = "I"+id+"I";
                            ///post(make,model,year,cyl,odo,driver_train,engine,id,images);
                        }else{
                            console.warn("მოდელი ვერ მოიძებნა");
                        }
    
                    }
                });

            });
        }
});