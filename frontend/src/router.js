import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<Home />}/>
                <Route path="/register" exact element={<Register />}/>
                <Route path="/register/:edit" exact element={<Register />}/>
            </Routes>
        </BrowserRouter>
    );
}