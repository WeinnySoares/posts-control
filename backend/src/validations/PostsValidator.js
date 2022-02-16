const valid = require('validator');

module.exports = {
    index(req,resp,next){
        let {page} = req.query;
       
        if(page && !valid.isInt(page)){        
            return resp.json('{"data":"null",erro:"true","msg":"Pagina invalida!"}');
        }

        next();
    },
    search(req,resp,next){ 
        //return resp.json('{"data":"null",erro:"true","msg":"Favor preecher o campo");
        next();
    },
    create(req,resp, next){

       /*let invalidInputs = [];

        
        let {
                name, 
                description,
                cover_image,
                status,
                user_id,
                related_post_id
        } = req.body;

        if(invalidInputs.length > 0){
            let msg = 'Dados invalidos! favor verificar o(s) campo(s) a seguir:<br><strong>'+
                invalidInputs.split()+
                '</strong>';

            return resp.json('{"data":"null",erro:"true","msg":"'+msg+'"}');
        }*/

        next();
    },
    alter(req,resp,next){  
        //return resp.json('{"data":"null",erro:"true","msg":"Favor preecher o campo");
        next();
    },
    delete(req,resp,next){
        //return resp.json('{"data":"null",erro:"true","msg":"Favor preecher o campo");
        next();

    }
}