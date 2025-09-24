# Writa - Uygulama Kuralları ve İşleyişi (Application Rules & Logic)

Bu dosya, uygulamanın temel işleyiş kurallarını ve özelliklerini içerir. Gelecekteki tüm geliştirmeler, burada belirtilen kurallara uygun olarak yapılmalı ve mevcut işleyişi bozmamalıdır.
_This file documents the core logic and rules of the application. All future development must adhere to these rules and avoid breaking existing functionality._

---

## 0. Değiştirilemez Çekirdek Kurallar (Non-Negotiable Core Rules)

**DİKKAT:** Bu bölümde listelenen kurallar, uygulamanın kararlı çalışması için temeldir. Kod yöneticisi (kullanıcı) onayı olmadan bu kurallar değiştirilemez. Tüm yeni geliştirmeler, bu bölümdeki kuralların bozulmadığı kontrol edilerek yapılmalıdır.
_**ATTENTION:** The rules listed in this section are fundamental to the stable operation of the application. These rules cannot be changed without the approval of the code manager (the user). All new developments must be made while ensuring that the rules in this section are not broken._

1.  **Sıfırdan Oluşturma ("Generate from Scratch"):** "Oluştur" butonuna her tıklandığında, mevcut tüm tasarımlar temizlenmeli (`setDesigns([])`) ve girdiler (başlık ve metin) kullanılarak tamamen yeni bir tasarım seti sıfırdan oluşturulmalıdır.
2.  **Kesin 12 Satır Limiti ("Strict 12-Line Limit"):** Ana metin, `ImageCanvas` içinde programatik olarak bölünür. Her bir görsel (slayt), **kesinlikle 12 satırı geçemez**. Bu bir yapay zeka önerisi değil, kod tarafından uygulanan katı bir kuraldır.
3.  **Taşma Engeli ("No Overflow"):** Hem başlık hem de gövde metni, her zaman kanvasın ortasındaki metin kutusu alanının **içinde kalmalıdır**. Metin, bu alanın dışına dikey veya yatay olarak **asla taşmamalıdır**. Uzun başlıklar otomatik olarak alt satırlara sarılmalıdır.
4.  **Otomatik Başlık Mantığı ("Automatic Title Logic"):** Kullanıcı bir başlık belirtmemişse, girilen metnin ilk cümlesi otomatik olarak başlık olarak kullanılır. Bu durumda, başlık olarak kullanılan bu cümle ana metnin başından **kesinlikle çıkarılmalıdır**.
5.  **Geniş Ekran Panel Oranı ("Widescreen Panel Ratio"):** Masaüstü gibi geniş ekranlarda, sol kontrol paneli (İçerik & Tasarım) `lg:col-span-5` (yaklaşık %40) ve sağ tasarım alanı `lg:col-span-7` (yaklaşık %60) genişliğinde olmalıdır. (Eklendi - 2025-09-24 13:15)
6.  **"Yapışkan" Kontrol Paneli ("Sticky Control Panel"):** Masaüstü gibi daha geniş ekranlarda, kullanıcı sayfayı aşağı kaydırdığında sol taraftaki kontrol paneli ekranın soluna **sabitlenmelidir** (`sticky`). (Eklendi - 2025-09-24 12:55)
7.  **Mobil Düzen ("Mobile Layout"):** Mobil cihazlarda (daha küçük ekranlarda), kontrol paneli ve tasarım önizleme alanı yan yana değil, **alt alta** görüntülenmelidir. (Eklendi - 2025-09-24 12:55)
8.  **Dikey Arka Plan Önizlemesi ("Portrait Background Previews"):** Gradyan ve Görsel seçimi sekmelerindeki küçük resim önizlemeleri, nihai tasarımın 1080x1350 en-boy oranını yansıtacak şekilde dikey olmalıdır. (Eklendi - 2025-09-25 10:20)

---

## 1. Metin İşleme ve Yapay Zeka Maliyetleri (Text Processing & AI Costs)

- **TR:** Ana metnin geri kalanı, bir sonraki 12 satırlık görsele otomatik olarak aktarılır.
- **EN:** The remaining text is automatically carried over to the next 12-line image.

### 1.1. Yapay Zeka Özellikleri ve Maliyet Detayları

Uygulamada maliyet oluşturan 2 adet yapay zeka destekli özellik bulunmaktadır:

**1. Metin İşleme (`automaticallySplitTextIntoParagraphs`):**
    - **Servis:** Google Gemini (`gemini-1.5-flash` modeli)
    - **Tetiklenme:** "Oluştur" butonuna her basıldığında çalışır.
    - **Maliyetlendirme:** Bu işlem, Google'ın token tabanlı ücretlendirme modeline göre maliyet oluşturur. Maliyet, hem girdiğiniz metnin uzunluğuna (input token) hem de yapay zekanın ayırdığı başlık ve paragrafın uzunluğuna (output token) bağlıdır. Detaylı ve güncel fiyatlandırma için [Google AI Platform Fiyatlandırma](https://ai.google/pricing) sayfasını kontrol ediniz.

**2. Görsel Arama (`findImages`):**
    - **Servis:** Google Custom Search API
    - **Tetiklenme:** "Görsel Ara" kutusuna bir arama terimi yazıp "Ara" butonuna basıldığında çalışır.
    - **Maliyetlendirme:** Bu özellik Gemini token maliyeti **oluşturmaz**. Bunun yerine, Google Cloud Platform altındaki "Custom Search API" hizmetinin kendi kullanım limitleri ve ücretlendirmesine tabidir. Google, genellikle aylık belirli bir sorgu sayısına kadar ücretsiz bir kullanım hakkı tanır. Bu ücretsiz limit aşıldıktan sonra, yapılan her sorgu başına bir ücretlendirme uygulanır. Detaylı bilgi için Google Cloud Console'daki ilgili API'nin "Kotalar ve Fiyatlandırma" bölümüne bakınız.

---

## 2. Kanvas ve Tasarım Kuralları (Canvas & Design Rules)

- **TR:** Kullanıcı, "Yazı Tipi Ayarları" bölümünden tasarım üzerindeki metnin rengini bir renk seçici aracılığıyla değiştirebilmelidir. (Eklendi - 2024-09-24 12:40)
- **TR:** Kullanıcı, seçtiği arka plan türünden (Düz Renk, Gradyan, Görsel) bağımsız olarak, kanvasın ortasındaki metin kutusunun rengini ve 0 ile 1 arasında şeffaflığını ayarlayabilmelidir. Bu ayarlar, "Yazı Tipi" seçim alanının altında ve "Arka Plan" seçim sekmelerinden önce ayrı bir bölümde yer almalıdır. (Eklendi - 2025-09-24 14:02)
- **TR:** Kullanıcı, metin hizalamasını (sol, orta, sağ) seçebilmelidir. Bu ayar "Yazı Tipi Ayarları" bölümünde yer alır. (Eklendi - 2025-09-24 15:45)
- **EN:** The user should be able to change the color of the text on the design via a color picker in the "Font Settings" section. (Added - 2024-09-24 12:40)
- **EN:** Regardless of the chosen background type (Flat Color, Gradient, Image), the user should be able to adjust the color and opacity (from 0 to 1) of the text box in the center of the canvas. These settings should be located in a separate section below the "Font" selection area and before the "Background" selection tabs. (Added - 2025-09-24 14:02)
- **EN:** The user should be able to choose the text alignment (left, center, right). This setting is located in the "Font Settings" section. (Added - 2025-09-24 15:45)

## 3. Font ve Karakter Desteği (Font & Character Support)

- **TR:** Google Fonts'tan yüklenen tüm yazı tipleri, `&display=swap` parametresi ile `latin-ext` karakter setini içermelidir. Bu, 'ş', 'ç', 'ğ', 'ı', 'ü', 'ö' gibi Türkçe karakterlerin tüm fontlarda doğru bir şekilde görüntülenmesini sağlar.
- **TR:** Font seçim menüsünde, her bir font seçeneğinin adı kendi yazı tipiyle görüntülenmelidir. Bu, kullanıcının fontları seçmeden önce nasıl göründüklerini önizlemesini sağlar (Örn: "Inter" yazısı Inter fontuyla yazılmalıdır). (Eklendi - 2025-09-24 12:50)
- **TR:** Yazı tipi seçim menüsündeki varsayılan font "Special Elite" olarak ayarlanmıştır. (Eklendi - 2025-09-25 10:10)
- **EN:** All fonts loaded from Google Fonts must include the `latin-ext` character set via the `&display=swap` parameter. This ensures that Turkish characters like 'ş', 'ç', 'ğ', 'ı', 'ü', 'ö' are displayed correctly across all fonts.
- **EN:** In the font selection menu, the name of each font option should be displayed in its own font style. This allows the user to preview how the fonts look before selecting them (e.g., the text "Inter" should be written in the Inter font). (Added - 2025-09-24 12:50)
- **EN:** The default font in the font selection dropdown is set to "Special Elite". (Added - 2025-09-25 10:10)
---

### PLANLANAN ADIMLAR (PLANNED STEPS)
*** Not: Bu alanda yer alan maddelerdeki değişiklikler yapıldıktan sonra ilgili bölüme eklenmeli. Eklendikten sonra sonuna eklendiği tarih ve saat parantez içinde yazılmalı. ***
*Note: After the changes in the items in this area are made, they should be added to the relevant section. After being added, the date and time of addition should be written in parentheses at the end.*

(Tüm planlanan adımlar tamamlandı. Yeni görevler buraya eklenebilir.)
