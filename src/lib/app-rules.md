# Post Weaver - Uygulama Kuralları ve İşleyişi (Application Rules & Logic)

Bu dosya, uygulamanın temel işleyiş kurallarını ve özelliklerini içerir. Gelecekteki tüm geliştirmeler, burada belirtilen kurallara uygun olarak yapılmalı ve mevcut işleyişi bozmamalıdır.
_This file documents the core logic and rules of the application. All future development must adhere to these rules and avoid breaking existing functionality._

---

## 1. Metin İşleme ve Görsel Oluşturma (Text Processing & Image Generation)

### 1.1. "Oluştur" Butonu Davranışı (Generate Button Behavior)

- **TR:** "Oluştur" butonuna her tıklandığında, mevcut tüm tasarımlar temizlenmeli ve girdiler (başlık ve metin) kullanılarak tamamen yeni bir tasarım seti sıfırdan oluşturulmalıdır. Bu, eski tasarımların kalmasını ve tutarsızlığa yol açmasını engeller.
- **EN:** Every time the "Generate" button is clicked, all existing designs must be cleared, and a completely new set of designs must be generated from scratch using the current inputs (title and text). This prevents old designs from persisting and causing inconsistencies.

### 1.2. Otomatik Başlık (Automatic Title)

- **TR:** Kullanıcı bir başlık belirtmemişse, girilen metnin ilk cümlesi otomatik olarak başlık olarak kullanılır. Bu durumda, başlık olarak kullanılan bu cümle ana metnin başından **kesinlikle çıkarılmalıdır**. Başlık ve metin arasında tekrar olamaz.
- **EN:** If the user does not provide a title, the first sentence of the input text is automatically used as the title. In this case, this sentence used as the title **must be removed** from the beginning of the main body text. There can be no repetition between the title and the body.

### 1.3. Paragraf ve Satır Bölme (Paragraph and Line Splitting)

- **TR:** Ana metin, `ImageCanvas` bileşeni içinde programatik olarak bölünür. Her bir görsel (slayt), **kesinlikle 12 satırı geçemez**. Bu bir yapay zeka önerisi değil, kod tarafından uygulanan katı bir kuraldır. Metnin geri kalanı, bir sonraki 12 satırlık görsele otomatik olarak aktarılır.
- **EN:** The main body text is split programmatically within the `ImageCanvas` component. Each generated image (slide) **must absolutely not exceed 12 lines**. This is a strict, code-enforced rule, not an AI suggestion. The remaining text is automatically carried over to the next 12-line image.

## 2. Kanvas ve Tasarım Kuralları (Canvas & Design Rules)

### 2.1. Metin Yerleşimi ve Sınırları (Text Placement & Boundaries)

- **TR:** Hem başlık hem de gövde metni, her zaman kanvasın ortasındaki beyaz dikdörtgen alanın **içinde kalmalıdır**. Metin, bu alanın dışına dikey veya yatay olarak **asla taşmamalıdır**. Metin, bu beyaz kutu içinde dikey ve yatay olarak ortalanmalıdır.
- **EN:** All text, both titles and body paragraphs, must always remain **inside** the central white rectangular area on the canvas. The text **must never overflow** this area, either vertically or horizontally. The text should be centered vertically and horizontally within this white box.

### 2.2. Başlık Metni Sarma (Title Text Wrapping)

- **TR:** Uzun başlıklar, beyaz kutunun genişliğini aşmamak için otomatik olarak alt satırlara sarılmalıdır. Tek bir satırda kalarak dışarı taşamazlar.
- **EN:** Long titles must automatically wrap to subsequent lines to avoid exceeding the width of the white box. They cannot remain on a single line and overflow.

## 3. Font ve Karakter Desteği (Font & Character Support)

- **TR:** Google Fonts'tan yüklenen tüm yazı tipleri, `&display=swap` parametresi ile `latin-ext` karakter setini içermelidir. Bu, 'ş', 'ç', 'ğ', 'ı', 'ü', 'ö' gibi Türkçe karakterlerin tüm fontlarda doğru bir şekilde görüntülenmesini sağlar.
- **EN:** All fonts loaded from Google Fonts must include the `latin-ext` character set via the `&display=swap` parameter. This ensures that Turkish characters like 'ş', 'ç', 'ğ', 'ı', 'ü', 'ö' are displayed correctly across all fonts.
