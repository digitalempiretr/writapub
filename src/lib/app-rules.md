# Writa - Uygulama Kuralları ve İşleyişi (Application Rules & Logic)

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

### 2.3. Metin Rengi (Text Color)

- **TR:** Kullanıcı, "Düz Renk" sekmesi altından tasarım üzerindeki metnin rengini bir renk seçici aracılığıyla değiştirebilmelidir. (Eklendi - 2025-09-24 12:40)
- **EN:** The user should be able to change the color of the text on the design via a color picker under the "Flat Color" tab. (Added - 2025-09-24 12:40)


## 3. Font ve Karakter Desteği (Font & Character Support)

### 3.1. Karakter Seti (Character Set)

- **TR:** Google Fonts'tan yüklenen tüm yazı tipleri, `&display=swap` parametresi ile `latin-ext` karakter setini içermelidir. Bu, 'ş', 'ç', 'ğ', 'ı', 'ü', 'ö' gibi Türkçe karakterlerin tüm fontlarda doğru bir şekilde görüntülenmesini sağlar.
- **EN:** All fonts loaded from Google Fonts must include the `latin-ext` character set via the `&display=swap` parameter. This ensures that Turkish characters like 'ş', 'ç', 'ğ', 'ı', 'ü', 'ö' are displayed correctly across all fonts.

### 3.2. Font Seçim Menüsü (Font Selection Menu)

- **TR:** Font seçim menüsünde, her bir font seçeneğinin adı kendi yazı tipiyle görüntülenmelidir. Bu, kullanıcının fontları seçmeden önce nasıl göründüklerini önizlemesini sağlar (Örn: "Inter" yazısı Inter fontuyla yazılmalıdır).
- **EN:** In the font selection menu, the name of each font option should be displayed in its own font style. This allows the user to preview how the fonts look before selecting them (e.g., the text "Inter" should be written in the Inter font).

## 4. Düzen ve Duyarlılık (Layout & Responsiveness)

### 4.1. Mobil Düzen (Mobile Layout)

- **TR:** Mobil cihazlarda (daha küçük ekranlarda), sol taraftaki kontrol paneli ve sağdaki tasarım önizleme alanı yan yana değil, **alt alta** görüntülenmelidir. Bu, her bir bölümün tam ekran genişliğinde rahatça kullanılmasını sağlar.
- **EN:** On mobile devices (smaller screens), the left control panel and the right design preview area must be stacked **vertically**, not side-by-side. This ensures each section is comfortably usable at full screen width.

### 4.2. "Yapışkan" Kontrol Paneli (Sticky Control Panel)

- **TR:** Masaüstü gibi daha geniş ekranlarda, kullanıcı sayfayı aşağı kaydırdığında sol taraftaki kontrol paneli ekranın soluna **sabitlenmelidir** ("sticky"). Bu, kullanıcının tasarımları incelerken kontrol ayarlarına her zaman erişebilmesini sağlar.
- **EN:** On larger screens like desktops, the left-side control panel must be **"sticky"** to the left side of the screen as the user scrolls down the page. This ensures the user always has access to the controls while reviewing the designs.



### PLANLANAN ADIMLAR *** Not: Bu alanda yer alan maddelerdeki değişiklikler yapıldıktan sonra ilgili bölüme eklenmeli. Eklendikten sonra sonuna eklendiği tarih ve saat parantez içinde yazılmalı.

- Orta alandaki beyaz dikey dikdörtgen yazı alanın da rengi ve transparancy ayarları (0 to 1) değişebilmeli.
-Başlıklar ve metinler sola dayalı (`text-align: left` veya `start`) olmalıdır.
