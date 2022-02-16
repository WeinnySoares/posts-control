import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiXCircle } from 'react-icons/fi';

import Logo from '../../assets/the-post-control.png';

import api from '../../services/api'

import moment from 'moment';

import './styles.css';

export default function Home() {
    let [posts, setPosts] = useState([]);
    let [find, setFind] = useState('');
    let [pages, setPages] = useState(1);

    useEffect(() => {
        reload();
    }, []);

    async function reload() {
        api.get('/').then(resp => {
            let pags = Math.ceil(resp.data.count / 5);
            setPosts(resp.data.data);
            setPages(pags);
        })
    }

    async function handlePage(number) {
        try {
            await api.get('/', { params: { page: number } })
                .then(resp => {
                    setPosts(resp.data.data);
                });
        } catch (error) {
            alert(error.data.msg);
        }
    }

    async function handleDeletePost(id) {
        try {
            await api.delete(`delete/${id}`);
            setPosts(posts.filter(post => post.id !== id));
        } catch (error) {
            alert('Erro ao remover este Post, tente novamente.')
        }
    }

    async function handleSearch() {
        try {
            await api.get('/search', { params: { term: find } })
                .then(resp => {
                    setPosts(resp.data.data);
                });
        } catch (error) {

        }
    }

    return (
        <div className="home-container">
            <header>
                <div className="logo">
                    <button onClick={() => reload()}>
                        <img src={Logo} width={96} height={90} alt="Logo Post Control" />
                    </button>
                </div>
            </header>
            <main>
                <div className="title">
                    <div className="row">
                        <h1>
                            Listagem de Postagens
                        </h1>
                        <Link className="button medium" to="/register" >
                            Novo Post
                        </Link>
                    </div>
                </div>
                <div className="content">
                    <div className="row">
                        <div className="search">
                            <input type="text" className="large" value={find} onChange={e => setFind(e.target.value)} name="search" />
                            <button className="button small" onClick={() => handleSearch()}>
                                Buscar
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <table>
                            <thead>
                                <tr>
                                    <td>Título do post</td>
                                    <td>Criador</td>
                                    <td>Status</td>
                                    <td>Data Atualização</td>
                                    <td>Ações</td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    posts.map(post => (
                                        <tr key={post.id} >
                                            <td>{post.name}</td>
                                            <td>{post.username}</td>
                                            <td>{post.status ? 'Ativo' : 'Desativado'}</td>
                                            <td>{moment(post.updated_at).format('DD/MM/YYYY hh:mm')}</td>
                                            <td>
                                                <Link to={"/register/" + post.id} type="button">
                                                    <FiEdit size={25} color="#333" />
                                                </Link>
                                                <button onClick={() => handleDeletePost(post.id)}>
                                                    <FiXCircle size={25} color="#333" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="row">
                        <div className="paginator">
                            {
                                Array.from({length: pages}, (_, i) => i + 1).map(i => (
                                    <button onClick={() => handlePage(i)}>{i}...</button> 
                                ))
                            }
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}