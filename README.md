# Yavaş Mektup

Mektubun anında gitmez. İpek Yolu, Osmanlı menzil postası ya da Akdeniz yelkenlisi gibi tarihi bir rotada kervan hızıyla yol alır, her durakta bir mühür toplar ve günler sonra varır.

## Nasıl çalışır

1. Mektubu yazarsın, bir rota seçersin.
2. Sana ve alıcıya birer takip bağlantısı gider. Alıcı yolculuğu izleyebilir ama içeriği göremez.
3. Mektup durakları geçtikçe mühürler basılır ve o durağın hikâyesi açılır.
4. Mektup varınca alıcıya e-posta gider. Alıcı mührü kırar, mektubu okur ve aynı yolun tersinden cevap yollayabilir.

Üyelik yok: her mektubun gönderen ve alıcı için ayrı, tahmin edilemez bir bağlantısı var.

## Yerelde çalıştırma

```bash
npm install
cp .env.example .env.local
TIME_SCALE=1440 npm run dev   # bir gün bir dakikada geçer
```

Supabase ve Resend anahtarları boşsa veriler bellekte tutulur ve e-postalar konsola yazılır.

## Yayına alma

1. **Supabase:** Yeni bir proje aç, `supabase/schema.sql` dosyasını SQL düzenleyicide çalıştır. `SUPABASE_URL` ve `SUPABASE_SERVICE_ROLE_KEY` değerlerini al.
2. **Resend:** Bir API anahtarı al ve gönderen alan adını doğrula (`RESEND_API_KEY`, `MAIL_FROM`).
3. **Vercel:** Repoyu içe aktar, `.env.example` içindeki değişkenleri gir. `NEXT_PUBLIC_SITE_URL` sitenin adresi olsun, `CRON_SECRET` için uzun rastgele bir metin yaz. `TIME_SCALE` canlıda 1 kalmalı.
4. **GitHub Actions:** Repo ayarlarında `SITE_URL` ve `CRON_SECRET` sırlarını ekle. `.github/workflows/deliver.yml` her 15 dakikada varan mektupların e-postasını gönderir.

## Yapı

- `lib/routes.ts`: rotalar, duraklar ve hikâyeler. Konum, gönderim zamanından ve yol uzunluğundan hesaplanır.
- `lib/actions.ts`: mektup gönderme, cevap ve açma işlemleri.
- `lib/store.ts`: Supabase ya da bellek içi veri katmanı.
- `app/m/[token]`: takip ve okuma sayfası.
- `app/api/cron/deliver`: varış e-postaları.
