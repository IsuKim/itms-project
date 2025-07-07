const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const { createTicket } = require('../models/ticketModel');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { getRepliesByTicketId, addReply } = require('../models/replyModel');

// 내 티켓 목록 (고객)
router.get('/my', verifyToken, async (req, res) => {
  const customer_id = req.user.id;
  const { status, urgency, keyword } = req.query;

  let query = `SELECT * FROM tickets WHERE customer_id = $1`;
  const params = [customer_id];
  let index = 2;

  if (status) {
    query += ` AND status = $${index++}`;
    params.push(status);
  }
  if (urgency) {
    query += ` AND urgency = $${index++}`;
    params.push(urgency);
  }
  if (keyword) {
    query += ` AND title ILIKE $${index++}`;
    params.push(`%${keyword}%`);
  }

  query += ` ORDER BY created_at DESC`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: '티켓 목록 조회 실패' });
  }
});

// 모든 티켓 목록 (관리자)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  const { status, urgency, keyword } = req.query;

  let query = `
    SELECT t.*, u.email AS customer_email, u.company_name
    FROM tickets t
    JOIN users u ON t.customer_id = u.id
    WHERE 1=1`;
  const params = [];
  let index = 1;

  if (status) {
    query += ` AND t.status = $${index++}`;
    params.push(status);
  }
  if (urgency) {
    query += ` AND t.urgency = $${index++}`;
    params.push(urgency);
  }
  if (keyword) {
    query += ` AND t.title ILIKE $${index++}`;
    params.push(`%${keyword}%`);
  }

  query += ` ORDER BY t.created_at DESC`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: '전체 티켓 조회 실패' });
  }
});

// 티켓 상세 정보 + 댓글 목록
router.get('/:id', verifyToken, async (req, res) => {
  const ticketId = req.params.id;

  try {
    const ticketRes = await pool.query('SELECT * FROM tickets WHERE id = $1', [ticketId]);
    if (ticketRes.rows.length === 0) return res.status(404).json({ message: '티켓 없음' });

    const replies = await getRepliesByTicketId(ticketId);

    res.json({ ticket: ticketRes.rows[0], replies });
  } catch (err) {
    res.status(500).json({ error: '티켓 상세 조회 실패' });
  }
});

// 댓글 추가
router.post('/:id/replies', verifyToken, async (req, res) => {
  const ticketId = req.params.id;
  const { message } = req.body;
  const author_id = req.user.id;

  if (!message) return res.status(400).json({ message: '내용을 입력하세요.' });

  try {
    const reply = await addReply({ ticket_id: ticketId, author_id, message });
    res.status(201).json(reply);
  } catch {
    res.status(500).json({ error: '댓글 등록 실패' });
  }
});

// 티켓 생성
router.post('/', verifyToken, async (req, res) => {
  const { title, description, urgency, product } = req.body;
  const customer_id = req.user.id;

  if (!title || !description) {
    return res.status(400).json({ message: '제목과 설명은 필수입니다.' });
  }

  try {
    const newTicket = await createTicket({ title, description, urgency, product, customer_id });
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).json({ error: '티켓 생성 실패' });
  }
});

module.exports = router;
