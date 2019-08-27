const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) =>{
  res.render('links/add');
})
//Agregar
router.post('/add', isLoggedIn, async (req, res) =>{
  const { title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id
  };
  await pool.query('INSERT INTO links set ?', [newLink]);
  req.flash('success', 'Link agregado correctamente');
  res.redirect('/links');
});
//Listar
router.get('/', isLoggedIn, async (req, res) =>{
  const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
  res.render('links/list', { links });
})
//Delete
router.get('/delete/:id', isLoggedIn, async(req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM links WHERE ID = ?', [id]);
  req.flash('success', 'Enlace removido correctamente');
  res.redirect('/links');
});
//Editar
router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const link = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);
  res.render('links/edit', { link: link[0]} );  
})
router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, description, url } = req.body;
  const newLink = {
    title,
    description,
    url
  };
  await pool.query('UPDATE links set ? where id = ?', [newLink, id]);
  req.flash('success', 'Link actualizado correctamente');
  res.redirect('/links');
});
module.exports = router;