const express = require('express');
const router = express.Router();
const {
  getAllSurat, getSuratById, createSurat, updateSurat,
  deleteSurat, kirimSurat, tandaTangan, tolakSurat,
  downloadPDF, previewPDF, getStatistik,
  uploadDokumenPendukungHandler, deleteDokumenPendukung,
} = require('../controllers/suratKeluar.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { uploadDokumenPendukung } = require('../middleware/upload.middleware');

router.use(authenticate);

router.get('/statistik', getStatistik);
router.get('/', getAllSurat);
router.get('/:id', getSuratById);
router.get('/:id/download', downloadPDF);
router.get('/:id/preview', previewPDF);

// Admin only
router.post('/', authorize('ADMIN'), createSurat);
router.put('/:id', authorize('ADMIN'), updateSurat);
router.delete('/:id', authorize('ADMIN', 'SEKRETARIS', 'KEPALA'), deleteSurat);
router.post('/:id/kirim', authorize('ADMIN'), kirimSurat);

// Upload dokumen pendukung (ADMIN only, maks 5 file)
router.post(
  '/:id/dokumen-pendukung',
  authorize('ADMIN'),
  uploadDokumenPendukung.array('dokumen', 5),
  uploadDokumenPendukungHandler
);
router.delete('/:id/dokumen-pendukung', authorize('ADMIN'), deleteDokumenPendukung);

// Sekretaris & Kepala
router.post('/:id/tanda-tangan', authorize('SEKRETARIS', 'KEPALA'), tandaTangan);
router.post('/:id/tolak', authorize('SEKRETARIS', 'KEPALA'), tolakSurat);

module.exports = router;
