# Veritabanı Mimarisi ve Planı (Firebase & Stripe)

Bu belge, uygulamanın kimlik doğrulama, veritabanı, kullanıcı rolleri ve ödeme sistemi için Firebase ve Stripe kullanarak oluşturulacak altyapısını detaylandırmaktadır.

## 1. Teknoloji Stack'i

*   **Kimlik Doğrulama:** Firebase Authentication (E-posta/Şifre, Google ile giriş)
*   **Veritabanı:** Cloud Firestore (NoSQL)
*   **Depolama:** Firebase Storage (Oluşturulan görseller için)
*   **Ödeme Altyapısı:** Stripe (Abonelik yönetimi için)

## 2. Ödeme Modeli: Katmanlı Aylık Abonelik

Kullanıcılar, farklı tasarım limitleri sunan aylık abonelik paketlerinden birini seçer.

*   **Paket 1:** £2/ay - 20 tasarım/ay
*   **Paket 2:** £5/ay - 75 tasarım/ay
*   **Paket 3:** £20/ay - Sınırsız tasarım

Stripe, bu aboneliklerin yönetimi, faturalandırma ve ödeme işlemleri için kullanılacaktır.

## 3. Kullanıcı Rolleri

Sistemde iki temel kullanıcı rolü olacaktır:

*   **`user`**: Standart kullanıcı. Kendi tasarımlarını oluşturabilir, kaydedebilir ve abonelik paketi limitleri dahilinde kullanabilir.
*   **`admin`**: Yönetici. Uygulamanın genel ayarlarını (paketler, fiyatlar), tasarım şablonlarını ve metin efektlerini yönetebilir. Ayrıca diğer kullanıcıları listeleyebilir.

## 4. Cloud Firestore Veritabanı Yapısı

Veriler, aşağıdaki koleksiyon yapısında saklanacaktır:

### `users` Koleksiyonu
Her döküman, Firebase Auth UID'si ile adlandırılır ve bir kullanıcıyı temsil eder.

*   **`role`** (string): Kullanıcının rolü. `'user'` (varsayılan) veya `'admin'`.
*   **`email`** (string): Kullanıcının e-posta adresi.
*   **`stripeCustomerId`** (string): Kullanıcının Stripe'daki müşteri ID'si. Abonelik ve ödeme takibi için kritiktir.
*   **`subscription`** (map):
    *   **`plan`** (string): Abone olunan paketin ID'si (örn: `paket_1`, `paket_2`).
    *   **`status`** (string): Abonelik durumu (`active`, `canceled`, `past_due`). Stripe Webhook'ları ile güncel tutulur.
    *   **`designs_created_this_period`** (number): Mevcut fatura döneminde oluşturulan tasarım sayısı. Limitli paketler için kullanılır.
    *   **`period_end`** (timestamp): Mevcut fatura döneminin bitiş tarihi.

### `products` Koleksiyonu
Yönetici tarafından yönetilen abonelik paketlerini içerir.

*   **`name`** (string): Paketin adı (örn: "Basic", "Pro").
*   **`price`** (number): Fiyat (kuruş/cent cinsinden, örn: 200 for £2.00).
*   **`currency`** (string): Para birimi (örn: `gbp`).
*   **`design_limit`** (number): Aylık tasarım limiti (`-1` sınırsız anlamına gelir).
*   **`stripePriceId`** (string): Bu paketin Stripe'daki fiyat ID'si.

### `user_designs` Koleksiyonu
Kullanıcıların kaydettiği her bir tasarım, bu koleksiyondaki bir dökümanı temsil eder. Döküman yapısı, uygulamanın "favorilere ekle" fonksiyonuyla uyumlu olacak şekilde aşağıdaki gibi olmalıdır:

*   **`userId`** (string): Tasarımı oluşturan kullanıcının Firebase Auth UID'si. Bu, Firestore güvenlik kuralları için gereklidir.
*   **`id`** (string): Benzersiz bir tasarım kimliği (örn: `design-1678886400000`).
*   **`name`** (string): Kullanıcının tasarıma verdiği isim (örn: `My First Design`).
*   **`text`** (string): Tasarımda kullanılan ana metin.
*   **`category`** (string): Tasarımın kategorisi. `'user-design'` olarak ayarlanır.
*   **`previewImage`** (string): Tasarımın base64 formatında veya bir URL olarak önizleme görüntüsü.
*   **`canvasSize`** (string): Kullanılan tuval boyutu (örn: `'Instagram Post'`).
*   **`background`** (map):
    *   **`type`** (string): Arka plan türü (`color`, `gradient`, `image`).
    *   **`value`** (string): Arka planın değeri (renk kodu, gradyan tanımı, resim URL'si).
*   **`font`** (map):
    *   **`value`** (string): Kullanılan font ailesi.
    *   **`color`** (string): Metin rengi.
    *   **`fontSize`** (number): Metin boyutu.
*   **`textBox`** (map):
    *   **`color`** (string): Metin kutusunun arka plan rengi.
    *   **`opacity`** (number): Metin kutusu arka planının opaklığı.
*   **`overlay`** (map):
    *   **`color`** (string): Tuval üzerindeki overlay rengi.
    *   **`opacity`** (number): Overlay opaklığı.
*   **`effect`** (map):
    *   **`id`** (string): Uygulanan metin efektinin kimliği.


### `design_templates` Koleksiyonu
Yönetici tarafından yönetilen ve `src/lib/design-templates.ts` dosyasındaki `DesignTemplate` tipine dayanan hazır tasarım şablonları.

*   **`id`** (string): Benzersiz şablon kimliği.
*   **`name`** (string): Şablonun adı.
*   **`category`** (string): Şablonun kategorisi (örn: "Yaz İndirimi", "Kara Cuma").
*   **`previewImage`** (string): Şablonun önizleme görüntüsünün URL'si.
*   **`canvasSize`** (string): Kullanılan tuval boyutu (örn: `'Instagram Post'`).
*   **`background`** (map):
    *   **`type`** (string): Arka plan türü (`color`, `gradient`, `image`).
    *   **`value`** (string): Arka planın değeri (renk kodu, gradyan tanımı, resim URL'si).
*   **`font`** (map):
    *   **`value`** (string): Kullanılan font ailesi.
    *   **`color`** (string): Metin rengi.
    *   **`fontSize`** (number): Metin boyutu.
*   **`textBox`** (map):
    *   **`color`** (string): Metin kutusunun arka plan rengi.
    *   **`opacity`** (number): Metin kutusu arka planının opaklığı.
*   **`overlay`** (map):
    *   **`color`** (string): Tuval üzerindeki overlay rengi.
    *   **`opacity`** (number): Overlay opaklığı.
*   **`effect`** (map):
    *   **`id`** (string): Uygulanan metin efektinin kimliği.

### `text_effects` Koleksiyonu
Yönetici tarafından yönetilen metin efektleri.

### `text_effects` Koleksiyonu
Yönetici tarafından yönetilen ve `src/lib/text-effects.ts` dosyasındaki `TextEffect` tipine dayanan metin efektleri.

*   **`id`** (string): Benzersiz efekt kimliği.
*   **`name`** (string): Efektin adı (örn: "3D Çizgi Film", "Neon").
*   **`preview`** (map): Efektin önizleme kartındaki görünümü için stiller.
    *   **`text`** (string): Önizlemede gösterilecek örnek metin.
    *   **`fontValue`** (string, isteğe bağlı): Önizleme için kullanılacak özel font ailesi.
    *   **`color`** (string): Önizleme metninin rengi.
    *   **`textShadow`** (string): Önizleme için uygulanacak CSS `text-shadow` değeri.
*   **`styles`** (map): Efektin tuval üzerine uygulandığında kullanılacak ana stilleri.
    *   **`fontValue`** (string, isteğe bağlı): Efektin kendine ait özel font ailesi.
    *   **`color`** (string): Ana metnin rengi.
    *   **`textShadow`** (string): Ana metne uygulanacak CSS `text-shadow` değeri.

