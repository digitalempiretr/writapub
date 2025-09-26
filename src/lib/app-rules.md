# Writa - Application Rules & Logic (Uygulama Kuralları ve İşleyişi)

This document outlines the core rules, logic, and version history of the Writa application. All future development must adhere to these rules, and changes will be documented under a new version number at the top of this file.
_Bu belge, Writa uygulamasının temel kurallarını, işleyişini ve sürüm geçmişini içerir. Gelecekteki tüm geliştirmeler bu kurallara uygun olmalı ve yapılan değişiklikler dosyanın en üstüne yeni bir sürüm numarası ile belgelenmelidir._

---

---

# Version History (Sürüm Geçmişi)

_New versions will be added to the top of this section._
_Yeni sürümler bu bölümün en üstüne eklenecektir._

---

## Version V1.03

#### ENGLISH
### 1. Documentation & Process
-   **AI Development Process Update:** The core rules for the AI have been updated. The AI must now:
    1.  Always review `app-rules.md` before initiating any change to understand the project's current state and rules.
    2.  Check `plans.md` for tasks. If the file is empty, the AI is instructed to proactively suggest new features or improvements in the chat.

#### TURKCE
### 1. Dokümantasyon ve Süreç
-   **Yapay Zeka Geliştirme Süreci Güncellemesi:** Yapay zeka için temel kurallar güncellendi. Yapay zeka artık:
    1.  Herhangi bir değişikliğe başlamadan önce projenin mevcut durumunu ve kurallarını anlamak için daima `app-rules.md` dosyasını incelemelidir.
    2.  Görevler için `plans.md` dosyasını kontrol etmelidir. Eğer dosya boşsa, yapay zekanın sohbette proaktif olarak yeni özellikler veya iyileştirmeler önermesi talimatı verilmiştir.

---

## Version V1.02

#### ENGLISH
### 1. Documentation & Process
-   **Version Control Rule:** A new non-negotiable core rule has been added. It mandates that the version number in `app-rules.md` must be incremented after every change, and the completed tasks must be removed from `plans.md`.

#### TURKCE
### 1. Dokümantasyon ve Süreç
-   **Sürüm Kontrolü Kuralı:** Değiştirilemez çekirdek kurallara yeni bir kural eklendi. Bu kural, her değişiklikten sonra `app-rules.md` dosyasındaki sürüm numarasının artırılmasını ve tamamlanan görevlerin `plans.md`'den kaldırılmasını zorunlu kılar.

---

## Version V1.01

#### ENGLISH
### 1. UI & Branding Updates
-   **Logo:** The application logo has been changed. It now uses the "Libertinus Keyboard" font from Google Fonts. The logo text is uppercase and has a fixed size of `2rem` on all screen sizes.
-   **Header:** The "Are You Writa?" slogan has been removed. The logo is now left-aligned.
-   **Control Panel Title:** The title of the left control panel has been changed from "İçerik & Tasarım" to a cleaner "Creative Magic".

#### TURKCE
### 1. Arayüz ve Marka Güncellemeleri
-   **Logo:** Uygulama logosu değiştirildi. Artık Google Fonts'tan "Libertinus Keyboard" yazı tipini kullanıyor. Logo metni büyük harfle yazılmıştır ve tüm ekran boyutlarında `2rem` sabit boyutuna sahiptir.
-   **Başlık Alanı:** "Are You Writa?" sloganı kaldırıldı. Logo artık sola hizalanmış durumda.
-   **Kontrol Paneli Başlığı:** Sol kontrol panelinin başlığı "İçerik & Tasarım" yerine daha temiz bir ifade olan "Creative Magic" olarak değiştirildi.

---

## Version V1.0

This version represents the first stable release of the application, where the core text-to-image generation functionality is working reliably.
_Bu sürüm, uygulamanın temel metinden görsel oluşturma işlevinin güvenilir bir şekilde çalıştığı ilk kararlı sürümünü temsil eder._

### Non-Negotiable Core Rules (Değiştirilemez Çekirdek Kurallar)

**ATTENTION:** The rules listed in this section are fundamental to the stable operation of the application. These rules cannot be changed without the approval of the code manager (the user). All new developments must be made while ensuring that the rules in this section are not broken.
_**DİKKAT:** Bu bölümde listelenen kurallar, uygulamanın kararlı çalışması için temeldir. Kod yöneticisi (kullanıcı) onayı olmadan bu kurallar değiştirilemez. Tüm yeni geliştirmeler, bu bölümdeki kuralların bozulmadığı kontrol edilerek yapılmalıdır._

#### English Core Rules
1.  **AI Pre-development Check:** Before starting any development, the AI must first review the `app-rules.md` file to understand all existing rules and the current state of the project.
2.  **AI Task & Suggestion Protocol:** The AI must check `plans.md` for planned tasks. If the file is empty and there are no user instructions, the AI should proactively suggest new features or improvements in the chat.
3.  **Version Control:** After every completed task or set of changes, the `app-rules.md` file must be updated with a new incremental version number (e.g., V1.01, V1.02), and the changes must be documented under that new version. Completed tasks must be removed from `plans.md`.
4.  **Generate from Scratch:** Every time the "Generate" button is clicked, all existing designs must be cleared (`setDesigns([])`), and a completely new set of designs must be created from scratch using the inputs (title and text).
5.  **Dynamic Slide Generation:** The number of generated images (slides) is not fixed. It dynamically increases based on the length of the input text until all text is placed.
6.  **Flexible Line Limit (12-14 lines):** Each image (slide) should generally not exceed 12 lines. However, to avoid awkwardly splitting a sentence, if the remaining part of the sentence (e.g., 1 or 2 words) can fit, the current slide can be extended up to a maximum of 14 lines to keep the sentence intact. This is a strict rule enforced by the code.
7.  **No Overflow:** Both the title and body text must always remain **inside** the text box area in the center of the canvas. The text must **never** overflow vertically or horizontally outside this area. Long titles must automatically wrap to new lines.
8.  **Automatic Title Logic:** If the user has not specified a title, the first sentence of the entered text is automatically used as the title. In this case, this sentence used as the title **must be removed** from the beginning of the main text.
9.  **Paragraph & Newline Preservation:** Paragraphs and newlines entered by the user in the text area must be preserved and reflected in the final designs.
10. **Widescreen Panel Ratio:** On wide screens like desktops, the left control panel (Content & Design) should be `lg:col-span-5` (approx. 40%) and the right design area `lg:col-span-7` (approx. 60%) wide.
11. **"Sticky" Control Panel:** On wider screens like desktops, the left-side control panel should be **fixed (`sticky`)** to the left of the screen when the user scrolls down.
12. **Mobile Layout:** On mobile devices (smaller screens), the control panel and the design preview area should be displayed **one below the other**, not side-by-side.
13. **Portrait Background Previews:** The thumbnail previews in the Gradient and Image selection tabs must be portrait-oriented to reflect the final design's 1080x1350 aspect ratio.

#### Türkçe Çekirdek Kurallar
1.  **Yapay Zeka Geliştirme Öncesi Kontrol:** Yapay zeka, herhangi bir geliştirmeye başlamadan önce, mevcut tüm kuralları ve projenin mevcut durumunu anlamak için `app-rules.md` dosyasını gözden geçirmelidir.
2.  **Yapay Zeka Görev ve Öneri Protokolü:** Yapay zeka, planlanan görevler için `plans.md` dosyasını kontrol etmelidir. Eğer dosya boşsa ve kullanıcıdan bir talimat yoksa, yapay zeka sohbette proaktif olarak yeni özellikler veya iyileştirmeler önermelidir.
3.  **Sürüm Kontrolü:** Tamamlanan her görev veya değişiklik setinden sonra, `app-rules.md` dosyası yeni bir artan sürüm numarasıyla (örn: V1.01, V1.02) güncellenmeli ve yapılan değişiklikler o yeni sürüm altında belgelenmelidir. Tamamlanan görevler `plans.md` dosyasından silinmelidir.
4.  **Sıfırdan Oluşturma:** "Oluştur" butonuna her tıklandığında, mevcut tüm tasarımlar temizlenmeli (`setDesigns([])`) ve girdiler (başlık ve metin) kullanılarak tamamen yeni bir tasarım seti sıfırdan oluşturulmalıdır.
5.  **Dinamik Slayt Oluşturma:** Oluşturulan görsel (slayt) sayısı sabit değildir. Girilen metnin uzunluğuna göre, tüm metin yerleştirilene kadar dinamik olarak artar.
6.  **Esnek Satır Limiti (12-14 satır):** Her bir görsel (slayt) genellikle 12 satırı geçmemelidir. Ancak, bir cümlenin anlamsız bir yerde bölünmesini önlemek amacıyla, eğer cümlenin geri kalan kısmı (örneğin 1-2 kelime) sığıyorsa mevcut slayt cümleyi bir arada tutmak için en fazla 14 satıra kadar uzatılabilir. Bu, kod tarafından uygulanan katı bir kuraldır.
7.  **Taşma Engeli:** Hem başlık hem de gövde metni, her zaman kanvasın ortasındaki metin kutusu alanının **içinde kalmalıdır**. Metin, bu alanın dışına dikey veya yatay olarak **asla taşmamalıdır**. Uzun başlıklar otomatik olarak alt satırlara sarılmalıdır.
8.  **Otomatik Başlık Mantığı:** Kullanıcı bir başlık belirtmemişse, girilen metnin ilk cümlesi otomatik olarak başlık olarak kullanılır. Bu durumda, başlık olarak kullanılan bu cümle ana metnin başından **kesinlikle çıkarılmalıdır**.
9.  **Paragraf ve Satır Başı Koruma:** Kullanıcının metin alanına girdiği paragraflar ve satır başları korunmalı ve oluşturulan tasarımlara aynen yansıtılmalıdır.
10. **Geniş Ekran Panel Oranı:** Masaüstü gibi geniş ekranlarda, sol kontrol paneleli (İçerik & Tasarım) `lg:col-span-5` (yaklaşık %40) ve sağ tasarım alanı `lg:col-span-7` (yaklaşık %60) genişliğinde olmalıdır.
11. **"Yapışkan" Kontrol Paneli:** Masaüstü gibi daha geniş ekranlarda, kullanıcı sayfayı aşağı kaydırdığında sol taraftaki kontrol paneli ekranın soluna **sabitlenmelidir** (`sticky`).
12. **Mobil Düzen:** Mobil cihazlarda (daha küçük ekranlarda), kontrol panel ve tasarım önizleme alanı yan yana değil, **alt alta** görüntülenmelidir.
13. **Dikey Arka Plan Önizlemesi:** Gradyan ve Görsel seçimi sekmelerindeki küçük resim önizlemeleri, nihai tasarımın 1080x1350 en-boy oranını yansıtacak şekilde dikey olmalıdır.


#### ENGLISH

### 1. API Usage & Costs
   The application has 1 feature that uses an external API:
-   **Image Search (`findImages`):**
    -   **Service:** Pexels API
    -   **Trigger:** Runs when you type a search term in the "Image Search" box and press the "Search" button.
    -   **Cost Model:** This feature is subject to the Pexels API's usage limits. Pexels offers a free tier with a certain number of requests per hour. If you exceed this limit, you may need to wait or consider their commercial plans. For details, see the Pexels API documentation.
-   **Text Processing (`handleGenerate`):**
    -   **Service:** This is now handled by client-side JavaScript code.
    -   **Cost Model:** There is **no API cost** associated with generating designs from text. This operation is free.

### 2. Canvas & Design Rules
-   The user can change the color of the text on the design via a color picker in the "Font Settings" section.
-   Regardless of the chosen background type (Flat Color, Gradient, Image), the user can adjust the color and opacity (from 0 to 1) of the text box in the center of the canvas. These settings are located in a separate "Text Box Settings" section.
-   The user can choose the text alignment (left, center, right). This setting is located in the "Font Settings" section.

### 3. Font & Character Support
-   All fonts loaded from Google Fonts must include the `latin-ext` character set to ensure correct display of Turkish characters.
-   In the font selection menu, the name of each font option should be displayed in its own font style. This allows the user to preview how the fonts look before selecting them.
-   The default font in the font selection dropdown is set to "Special Elite".

#### TURKCE

### 1. API Kullanımı ve Maliyetler
Uygulamada harici API kullanan 1 adet özellik bulunmaktadır:
-   **Görsel Arama (`findImages`):**
    -   **Servis:** Pexels API
    -   **Tetiklenme:** "Görsel Ara" kutusuna bir arama terimi yazıp "Ara" butonuna basıldığında çalışır.
    -   **Maliyetlendirme:** Bu özellik, Pexels API'sinin kullanım limitlerine tabidir. Pexels, saatte belirli bir istek sayısına kadar ücretsiz bir kullanım hakkı sunar. Bu limit aşıldığında beklemeniz veya ticari planları değerlendirmeniz gerekebilir. Detaylar için Pexels API dokümantasyonuna bakınız.
-   **Metin İşleme (`handleGenerate`):**
    -   **Service:** Bu işlem artık istemci tarafı (client-side) JavaScript kodu ile yapılmaktadır.
    -   **Maliyetlendirme:** Metinden tasarım oluşturma işlemiyle ilişkili **herhangi bir API maliyeti yoktur**. Bu işlem ücretsizdir.

### 2. Kanvas ve Tasarım Kuralları
-   Kullanıcı, "Yazı Tipi Ayarları" bölümünden tasarım üzerindeki metnin rengini bir renk seçici aracılığıyla değiştirebilmelidir.
-   Seçtiği arka plan türünden (Düz Renk, Gradyan, Görsel) bağımsız olarak, kullanıcı kanvasın ortasındaki metin kutusunun rengini ve 0 ile 1 arasında şeffaflığını ayarlayabilmelidir. Bu ayarlar, ayrı bir "Metin Kutusu Ayarları" bölümünde yer alır.
-   Kullanıcı, metin hizalamasını (sol, orta, sağ) seçebilmelidir. Bu ayar "Yazı Tipi Ayarları" bölümünde yer alır.

### 3. Font ve Karakter Desteği
-   Google Fonts'tan yüklenen tüm yazı tipleri, Türkçe karakterlerin doğru görüntülenmesini sağlamak için `latin-ext` karakter setini içermelidir.
-   Font seçim menüsünde, her bir font seçeneğinin adı kendi yazı tipiyle görüntülenmelidir. Bu, kullanıcının fontları seçmeden önce nasıl göründüklerini önizlemesini sağlar.
-   Yazı tipi seçim menüsündeki varsayılan font "Special Elite" olarak ayarlanmıştır.
