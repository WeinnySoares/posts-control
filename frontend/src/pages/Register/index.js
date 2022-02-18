import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiXCircle } from 'react-icons/fi';

import Logo from '../../assets/the-post-control.png';

import api from '../../services/api'

import './styles.css';

export default function Register() {
    const [title, setTitle]                       = useState('');
    const [description, setDescription]           = useState('');
    const [cover_image, setCoverImage]            = useState(null);
    const [related_posts_ids, setRelatedPostsIds] = useState([]);
    const [status, setStatus]                     = useState(true);
    const [user_id, setUserId]                    = useState(0);

    const [findPost, setFindPost]                 = useState('');
    const [filterPosts, setFilterPosts]           = useState([]);
    const [findUser, setFindUser]                 = useState('');
    const [filterUsers, setFilterUsers]           = useState([]);
    const [relateds, setRelateds]                 = useState([]);

    const { edit = null }                         = useParams();
    const navigate                                = useNavigate();

    useEffect(() => {
        if (edit) {
            api.get('/', { params: { id: edit } }).then(resp => {
                let post = resp.data.data[0];
                setTitle(post.name);
                setDescription(post.description);
                setStatus(post.status);
            })
        }
        if (findPost == '') {
            setFilterPosts([])
        }
        if (findUser == '') {
            setFilterUsers([]);
        }
    }, [edit, findPost, findUser]);

    function autocompletePosts(event) {
        setFindPost(event.target.value);
        
        api.get('/search', { params: { term: findPost } }).then(resp => {
            setFilterPosts(resp.data.data);
        })
    }

    function autocompleteUsers(event) {
        setFindUser(event.target.value);
        
        let dataUsers = [
            { id: 1, name: 'joão' },
            { id: 2, name: 'jose' },
            { id: 3, name: 'josué' }
        ]

        var newArray = dataUsers.filter(
            value => {
                return value.name.includes(findPost)
            }
        );

        setFilterUsers(newArray);
    }

    function handleAddUser(user) {
        setFindUser(user.name);
        setUserId(user.id);
        setFilterUsers([]);
    }

    function handleAddRelated(post) {
        if (!related_posts_ids.includes(post.id)) {
            let postIdsTmp = related_posts_ids;
            let relatedsTmp = relateds;

            postIdsTmp.push(post.id);
            relatedsTmp.push(post);

            setRelatedPostsIds(postIdsTmp);
            setRelateds(relatedsTmp);
        }

        setFilterPosts([]);
    }

    function handleRemoveRelated(id) {
        let postIdsTmp = related_posts_ids.filter(postId => {
            return postId != id;
        });
        let relatedsTmp = relateds.filter(value => {
            return value.id != id
        });

        setRelatedPostsIds(postIdsTmp);
        setRelateds(relatedsTmp);
    }

    function handleRegister(e) {
        e.preventDefault();
        let data = {
            name: title,
            description,
            cover_image,
            related_posts_ids,
            status,
            user_id
        }

        try {
            api.post('/create', data).then(
                resp => {
                    alert(resp.data.msg);
                    navigate('/');
                }
            )
        } catch (error) {
            alert('Erro ao gravar este post');
        }

    }

    return (
        <div className="register-container">
            <header>
                <div className="logo">
                    <Link to='/'>
                        <img src={Logo} width={96} height={90} alt="Logo Post Control" />
                    </Link>
                </div>
            </header>
            <main>
                <div className="title">
                    <div className="row">
                        <h1>
                            Cadastro
                        </h1>
                    </div>
                </div>
                <div className="content">
                    <form onSubmit={handleRegister}>
                        <div className="row">
                            <label htmlFor="">Título</label>
                            <input
                                type="text"
                                className="large"
                                value={title}
                                onChange={
                                    e => setTitle(e.target.value)
                                }
                            />
                        </div>
                        <div className="row">
                            <label htmlFor="">Descrição</label>
                            <textarea
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                        <div className="row">
                            <label htmlFor="">Imagem Capa</label>
                            <div className="upload" >
                                <input type="file" onChange={e => setCoverImage(e.target.files[0])} name="cover_image" />
                                <span>Buscar</span>
                            </div>
                        </div>
                        <div className="row">
                            <label htmlFor="">Post Relacionados</label>
                            <div className="related_posts-container">
                                <input type="text" name="related_posts_ids"
                                    value={findPost}
                                    onChange={autocompletePosts}
                                />
                                {filterPosts !== 0 &&
                                    <div className="data-results">

                                        {
                                            filterPosts.map(item => (
                                                <div
                                                    className="data-item"
                                                    onClick={() => handleAddRelated(item)}
                                                    key={item.id}
                                                >{item.name}</div>
                                            ))
                                        }
                                    </div>
                                }
                                <div className="related_posts_edit">
                                    {relateds.map(post => (
                                        <button
                                            onClick={() => handleRemoveRelated(post.id)}
                                        >{post.name}<FiXCircle /></button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <label htmlFor="">Status</label>
                            <div className="status-container">
                                <select type="text" name="status" className="small" value={status} onChange={e => setStatus(e.target.value)} >
                                    <option value="true"> Ativado</option>
                                    <option value="false"> Desativado</option>
                                </select>
                            </div>
                        </div>
                        <div className="row">
                            <label htmlFor="">Criador Post</label>
                            <div className="user-container">
                                <input type="text" name="" value={findUser} onChange={autocompleteUsers} />
                                {filterUsers !== 0 &&
                                    <div className="data-results">
                                        {
                                            filterUsers.map(item => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => handleAddUser(item)}
                                                    className="data-item"
                                                >{item.name}</div>
                                            ))
                                        }
                                    </div>
                                }
                                <input type="hidden" name="user_id" />
                            </div>
                        </div>
                        <div className="row">
                            <button type="submit" className="button small">
                                Gravar
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
