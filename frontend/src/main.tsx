import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import Home from './pages/Home.tsx';
import Article from './pages/Article.tsx';
import ArticleList from './pages/ArticleList.tsx';
import Navbar from './components/Navbar.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:articleId" element={<Article />} />
        <Route path="/articleList" element={<ArticleList />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
