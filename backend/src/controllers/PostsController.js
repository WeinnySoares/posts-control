const connection = require('../database/connection');

module.exports = {
    
    async index(req,resp){
        const {page = 1, id = null} = req.query;
        const limit = 5;

        const [count] = await connection('posts').count();

        let posts = [];

        if(id){
            posts = await connection('posts')
                .join('users','users.id','=','posts.user_id')
                .select([
                    'posts.*',
                    'users.name as username'
                ])
                .where('posts.id',id)
            ;

        }else{
            posts = await connection('posts')
                .join('users','users.id','=','posts.user_id')
                .limit(limit)
                .offset((page -1) * limit)
                .select([
                    'posts.*',
                    'users.name as username'
                ])
            ;
        }

        return resp.status(200).json({"data":posts,"erro":false,"msg":null,'count':count['count(*)']});
    },
    
    async search(req,resp){
        let {term} = req.query;

        const posts = await connection('posts')
            .join('users','users.id','=','posts.user_id')
            .select([
                'posts.*',
                'users.name as username'
            ])
            .whereLike('posts.name',`%${term}%`)
        ;
        return resp.status(200).json({"data":posts,"erro":false,"msg":null});
    },
    async create(req,resp){
        let {
            name,
            description, 
            cover_image,
            status,
            related_posts_ids = [],
            user_id
        } = req.body

        const [id] = await connection('posts').insert({
            name,
            description,
            cover_image,
            status,
            user_id,
        });
        
        if(related_posts_ids.length > 0){
            let related_posts = related_posts_ids.map(related_id => {
                return {post_id: id, related_post_id: related_id};
            });
            await connection('related_posts').insert(related_posts);
        }

        return resp.status(201).json({"data":null,"erro":false,"msg":"Post gravado com sucesso!"});
    },
    async alter(req,resp){ 
        let {
            name,
            description,
            cover_image,
            status,
            related_posts_ids = [],
            user_id 
        } = req.body
        let {id} = req.params;

        await connection('posts').update({
            name,
            description,
            cover_image,
            status,
            user_id,
        })
        .where('id',id);
        
        if(related_posts_ids.length == 0){
            await connection('related_posts')
                .where('post_id',id)
                .delete()
            ;
        }else{ 
            let related_posts = related_posts_ids.map(related_id => {
                return {post_id: id, related_post_id: related_id};
            });

            await connection('related_posts')
                .insert(related_posts)
            ;

            await connection('related_posts')
                .whereNotIn('related_post_id',related_posts_ids)
                .where('post_id',id)
                .delete()
            ;
        }

        return resp.status(201).json({"data":null,"erro":false,"msg":"Post alterado com sucesso!"});
    },
    async delete(req,resp){
        let {id} = req.params;

        await connection('posts').where('id',id).delete();
        await connection('related_posts').where('post_id',id).delete();

        return resp.status(201).json({"data":null,"erro":false,"msg":"Post removido com sucesso!"});

    }
}