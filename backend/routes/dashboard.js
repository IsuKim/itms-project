const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// 관리자 대시보드: 티켓/사용자 통계
router.get('/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    const result = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM tickets WHERE status = '접수'`),
      pool.query(`SELECT COUNT(*) FROM tickets WHERE status = '진행중'`),
      pool.query(`SELECT COUNT(*) FROM tickets WHERE status = '답변 완료'`),
      pool.query(`SELECT COUNT(*) FROM tickets WHERE status = '종결'`),
      pool.query(`SELECT COUNT(*) FROM tickets`),
      pool.query(`SELECT COUNT(*) FROM users WHERE role = 'customer'`),
      pool.query(`SELECT COUNT(*) FROM users WHERE role = 'admin'`)
    ]);

    res.json({
      접수: result[0].rows[0].count,
      진행중: result[1].rows[0].count,
      답변완료: result[2].rows[0].count,
      종결: result[3].rows[0].count,
      전체티켓: result[4].rows[0].count,
      고객수: result[5].rows[0].count,
      관리자수: result[6].rows[0].count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '대시보드 통계 조회 실패' });
  }
});

module.exports = router;
