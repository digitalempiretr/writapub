# Writa - Application Rules & Logic (Uygulama Kuralları ve İşleyişi)

This file documents the core logic and rules of the application. All future development must adhere to these rules and avoid breaking existing functionality.
_Bu dosya, uygulamanın temel işleyiş kurallarını ve özelliklerini içerir. Gelecekteki tüm geliştirmeler, burada belirtilen kurallara uygun olarak yapılmalı ve mevcut işleyişi bozmamalıdır._

---

## 0. Non-Negotiable Core Rules (Değiştirilemez Çekirdek Kurallar)

**ATTENTION:** The rules listed in this section are fundamental to the stable operation of the application. These rules cannot be changed without the approval of the code manager (the user). All new developments must be made while ensuring that the rules in this section are not broken.
_**DİKKAT:** Bu bölümde listelenen kurallar, uygulamanın kararlı çalışması için temeldir. Kod yöneticisi (kullanıcı) onayı olmadan bu kurallar değiştirilemez. Tüm yeni geliştirmeler, bu bölümdeki kuralların bozulmadığı kontrol edilerek yapılmalıdır._

### English
1.  **Generate from Scratch:** Every time the "Generate" button is clicked, all existing designs must be cleared (`setDesigns([])`), and a completely new set of designs must be created from scratch using the inputs (title and text).
2.  **Strict 12-Line Limit:** The main text is programmatically split within `ImageCanvas`. Each image (slide) **cannot exceed exactly 12 lines**. This is not an AI suggestion but a strict rule enforced by the code.
3.  **No Overflow:** Both the title and body text must always remain **inside** the text box area in the center of the canvas. The text must **never** overflow vertically or horizontally outside this area. Long titles must automatically wrap to new lines.
4.  **Automatic Title Logic:** If the user has not specified a title, the first sentence of the entered text is automatically used as the title. In this case, this sentence used as the title **must be removed** from the beginning of the main text.
5.  **Widescreen Panel Ratio:** On wide screens like desktops, the left control panel (Content & Design) should be `lg:col-span-5` (approx. 40%) and the right design area `lg:col-span-7` (approx. 60%) wide.
6.  **"Sticky" Control Panel:** On wider screens like desktops, the left-side control panel should be **fixed (`sticky`)** to the left of the screen when the user scrolls down.
7.  **Mobile Layout:** On mobile devices (smaller screens), the control panel and the design preview area should be displayed **one below the other**, not side-by-side.
8.  **Portrait Background Previews:** The thumbnail previews in the Gradient and Image selection tabs must be portrait-oriented to reflect the final design's 1080x1350 aspect ratio.

### Türkçe
1.  **Sıfırdan Oluşturma:** "Oluştur" butonuna her tıklandığında, mevcut tüm tasarımlar temizlenmeli (`setDesigns([])`) ve girdiler (başlık ve metin) kullanılarak tamamen yeni bir tasarım seti sıfırdan oluşturulmalıdır.
2.  **Kesin 12 Satır Limiti:** Ana metin, `ImageCanvas` içinde programatik olarak bölünür. Her bir görsel (slayt), **kesinlikle 12 satırı geçemez**. Bu bir yapay zeka önerisi değil, kod tarafından uygulanan katı bir kuraldır.
3.  **Taşma Engeli:** Hem başlık hem de gövde metni, her zaman kanvasın ortasındaki metin kutusu alanının **içinde kalmalıdır**. Metin, bu alanın dışına dikey veya yatay olarak **asla taşmamalıdır**. Uzun başlıklar otomatik olarak alt satırlara sarılmalıdır.
4.  **Otomatik Başlık Mantığı:** Kullanıcı bir başlık belirtmemişse, girilen metnin ilk cümlesi otomatik olarak başlık olarak kullanılır. Bu durumda, başlık olarak kullanılan bu cümle ana metnin başından **kesinlikle çıkarılmalıdır**.
5.  **Geniş Ekran Panel Oranı:** Masaüstü gibi geniş ekranlarda, sol kontrol paneli (İçerik & Tasarım) `lg:col-span-5` (yaklaşık %40) ve sağ tasarım alanı `lg:col-span-7` (yaklaşık %60) genişliğinde olmalıdır.
6.  **"Yapışkan" Kontrol Paneli:** Masaüstü gibi daha geniş ekranlarda, kullanıcı sayfayı aşağı kaydırdığında sol taraftaki kontrol paneli ekranın soluna **sabitlenmelidir** (`sticky`).
7.  **Mobil Düzen:** Mobil cihazlarda (daha küçük ekranlarda), kontrol paneli ve tasarım önizleme alanı yan yana değil, **alt alta** görüntülenmelidir.
8.  **Dikey Arka Plan Önizlemesi:** Gradyan ve Görsel seçimi sekmelerindeki küçük resim önizlemeleri, nihai tasarımın 1080x1350 en-boy oranını yansıtacak şekilde dikey olmalıdır.

---

## 1. Text Processing & AI Costs (Metin İşleme ve Yapay Zeka Maliyetleri)

### 1.1. AI Features and Cost Details
The application has 2 AI-powered features that generate costs:

**1. Text Processing (`automaticallySplitTextIntoParagraphs`):**
    - **Service:** Google Gemini (`gemini-1.5-flash` model)
    - **Trigger:** Runs every time the "Generate" button is pressed.
    - **Cost Model:** This process incurs costs based on Google's token-based pricing model. The cost depends on both the length of the text you input (input tokens) and the length of the title and paragraph separated by the AI (output tokens).

**2. Image Search (`findImages`):**
    - **Service:** Google Custom Search API
    - **Trigger:** Runs when you type a search term in the "Image Search" box and press the "Search" button.
    - **Cost Model:** This feature **does not** incur Gemini token costs. Instead, it is subject to the usage limits and pricing of the "Custom Search API" service under the Google Cloud Platform. Google typically offers a free tier for a certain number of queries per month. After this free limit is exceeded, a per-query fee is applied. For detailed information, see the "Quotas and Pricing" section of the relevant API in the Google Cloud Console.

### 1.2. Yapay Zeka Özellikleri ve Maliyet Detayları
Uygulamada maliyet oluşturan 2 adet yapay zeka destekli özellik bulunmaktadır:

**1. Metin İşleme (`automaticallySplitTextIntoParagraphs`):**
    - **Servis:** Google Gemini (`gemini-1.5-flash` modeli)
    - **Tetiklenme:** "Oluştur" butonuna her basıldığında çalışır.
    - **Maliyetlendirme:** Bu işlem, Google'ın token tabanlı ücretlendirme modeline göre maliyet oluşturur. Maliyet, hem girdiğiniz metnin uzunluğuna (input token) hem de yapay zekanın ayırdığı başlık ve paragrafın uzunluğuna (output token) bağlıdır. 

**2. Görsel Arama (`findImages`):**
    - **Servis:** Google Custom Search API
    - **Tetiklenme:** "Görsel Ara" kutusuna bir arama terimi yazıp "Ara" butonuna basıldığında çalışır.
    - **Maliyetlendirme:** Bu özellik Gemini token maliyeti **oluşturmaz**. Bunun yerine, Google Cloud Platform altındaki "Custom Search API" hizmetinin kendi kullanım limitleri ve ücretlendirmesine tabidir. Google, genellikle aylık belirli bir sorgu sayısına kadar ücretsiz bir kullanım hakkı tanır. Bu ücretsiz limit aşıldıktan sonra, yapılan her sorgu başına bir ücretlendirme uygulanır. Detaylı bilgi için Google Cloud Console'daki ilgili API'nin "Kotalar ve Fiyatlandırma" bölümüne bakınız.

---

## 2. Canvas & Design Rules (Kanvas ve Tasarım Kuralları)

### English
- The remaining text is automatically carried over to the next 12-line image.
- The user should be able to change the color of the text on the design via a color picker in the "Font Settings" section.
- Regardless of the chosen background type (Flat Color, Gradient, Image), the user should be able to adjust the color and opacity (from 0 to 1) of the text box in the center of the canvas. These settings should be located in a separate section below the "Font" selection area and before the "Background" selection tabs.
- The user should be able to choose the text alignment (left, center, right). This setting is located in the "Font Settings" section.

### Türkçe
- Ana metnin geri kalanı, bir sonraki 12 satırlık görsele otomatik olarak aktarılır.
- Kullanıcı, "Yazı Tipi Ayarları" bölümünden tasarım üzerindeki metnin rengini bir renk seçici aracılığıyla değiştirebilmelidir.
- Seçtiği arka plan türünden (Düz Renk, Gradyan, Görsel) bağımsız olarak, kullanıcı kanvasın ortasındaki metin kutusunun rengini ve 0 ile 1 arasında şeffaflığını ayarlayabilmelidir. Bu ayarlar, "Yazı Tipi" seçim alanının altında ve "Arka Plan" seçim sekmelerinden önce ayrı bir bölümde yer almalıdır.
- Kullanıcı, metin hizalamasını (sol, orta, sağ) seçebilmelidir. Bu ayar "Yazı Tipi Ayarları" bölümünde yer alır.

---

## 3. Font & Character Support (Font ve Karakter Desteği)

### English
- All fonts loaded from Google Fonts must include the `latin-ext` character set via the `&display=swap` parameter. This ensures that Turkish characters like 'ş', 'ç', 'ğ', 'ı', 'ü', 'ö' are displayed correctly across all fonts.
- In the font selection menu, the name of each font option should be displayed in its own font style. This allows the user to preview how the fonts look before selecting them (e.g., the text "Inter" should be written in the Inter font).
- The default font in the font selection dropdown is set to "Special Elite".

### Türkçe
- Google Fonts'tan yüklenen tüm yazı tipleri, `&display=swap` parametresi ile `latin-ext` karakter setini içermelidir. Bu, 'ş', 'ç', 'ğ', 'ı', 'ü', 'ö' gibi Türkçe karakterlerin tüm fontlarda doğru bir şekilde görüntülenmesini sağlar.
- Font seçim menüsünde, her bir font seçeneğinin adı kendi yazı tipiyle görüntülenmelidir. Bu, kullanıcının fontları seçmeden önce nasıl göründüklerini önizlemesini sağlar (Örn: "Inter" yazısı Inter fontuyla yazılmalıdır).
- Yazı tipi seçim menüsündeki varsayılan font "Special Elite" olarak ayarlanmıştır.

---

### PLANNED STEPS (PLANLANAN ADIMLAR)
***Not: Yeni görevler buraya eklenebilir.***
*Note: New tasks can be added here.*

(All planned steps have been completed. New tasks can be added here.)
