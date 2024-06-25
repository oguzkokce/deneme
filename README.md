# Lezizo Tarif Blogu

## Proje Hakkında

Lezizo, kullanıcıların tarifleri görüntüleyebileceği, ekleyebileceği, güncelleyebileceği ve silebileceği bir tarif blogudur. Kullanıcılar ayrıca tarifleri favorilerine ekleyebilir, tariflere puan verebilir ve yorum yapabilirler. Proje Node.js ve MongoDB kullanılarak geliştirilmiştir.

## Özellikler

- **Kullanıcı Yönetimi**:

  - Kayıt Olma
  - Giriş Yapma
  - Çıkış Yapma
  - Kullanıcı Profili Güncelleme

- **Tarif Yönetimi**:

  - Tarif Ekleme
  - Tarif Güncelleme
  - Tarif Silme
  - Son Eklenen Tarifler
  - Popüler Tarifler
  - Rastgele Tarifler
  - Tarif Arama
  - Tarif Puanlama
  - Favorilere Ekleme
  - Malzeme Listesi Görüntüleme

- **Yorum Yönetimi**:

  - Yorum Yapma
  - Yorum Güncelleme
  - Yorum Silme

- **Haber Yönetimi**:
  - Haber Ekleme
  - Haber Güncelleme
  - Haber Silme

## Kurulum

### Gereksinimler

- Node.js
- MongoDB
- npm

### Adımlar

1. Depoyu klonlayın:

   ```bash
   git clone https://github.com/oguzkokce/deneme.git
   cd deneme
   ```

2. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

3. Proje ana dizinine `.env` dosyası oluşturun ve MongoDB bağlantı stringinizi ekleyin:

   ```plaintext
   MONGODB_URI=mongodb+srv://<kullanıcı_adı>:<şifre>@cluster0.mongodb.net/
   ```

4. Uygulamayı başlatın:

   ```bash
   npm start
   ```

## Proje Yapısı

- **public/**: Statik dosyaları (CSS, JavaScript, görseller) içerir.
- **server/**: Sunucu tarafı kodları ve yönlendirmeleri içerir.
- **views/**: EJS şablon dosyalarını içerir.
- **models/**: Mongoose modellerini içerir.
- **routes/**: Uygulama rotalarını içerir.

## API Endpoint'leri

### Kullanıcılar

- `POST /register`: Yeni kullanıcı kaydı.
- `POST /login`: Kullanıcı girişi.
- `GET /logout`: Kullanıcı çıkışı.
- `PUT /users/:id`: Kullanıcı güncelleme.
- `DELETE /users/:id`: Kullanıcı silme.

### Tarifler

- `POST /recipes`: Yeni tarif ekleme.
- `PUT /recipes/:id`: Tarif güncelleme.
- `DELETE /recipes/:id`: Tarif silme.
- `GET /recipes/latest`: Son eklenen tarifler.
- `GET /recipes/popular`: Popüler tarifler.
- `GET /recipes/random`: Rastgele tarifler.
- `GET /recipes/search`: Tarif arama.
- `POST /recipes/:id/rate`: Tarif puanlama.
- `POST /recipes/:id/favorite`: Favorilere ekleme.

### Yorumlar

- `POST /recipes/:id/comments`: Yorum yapma.
- `PUT /comments/:id`: Yorum güncelleme.
- `DELETE /comments/:id`: Yorum silme.

### Haberler

- `POST /news`: Yeni haber ekleme.
- `PUT /news/:id`: Haber güncelleme.
- `DELETE /news/:id`: Haber silme.

## Katkıda Bulunma

1. Depoyu forklayın.
2. Yeni bir dal oluşturun (`git checkout -b feature/yenilik`).
3. Değişikliklerinizi commitleyin (`git commit -m 'Yeni özellik ekle'`).
4. Dala push yapın (`git push origin feature/yenilik`).
5. Bir Pull Request oluşturun.

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.

---

Bu dökümantasyonu projenizin README dosyasına ekleyebilirsiniz. Proje hakkında daha fazla bilgi veya yardım gerektiğinde, lütfen bana bildirin!
