# Writa - Application Rules & Logic (Uygulama Kuralları ve İşleyişi)

This document outlines the core rules, logic, and version history of the Writa application. All future development must adhere to these rules, and changes will be documented under a new version number at the top of this file.
_Bu belge, Writa uygulamasının temel kurallarını, işleyişini ve sürüm geçmişini içerir. Gelecekteki tüm geliştirmeler bu kurallara uygun olmalı ve yapılan değişiklikler dosyanın en üstüne yeni bir sürüm numarası ile belgelenmelidir._

---
---

### Non-Negotiable Core Rules (Değiştirilemez Çekirdek Kurallar)

**ATTENTION:** The rules listed in this section are fundamental to the stable operation of the application. These rules cannot be changed without the approval of the code manager (the user). All new developments must be made while ensuring that the rules in this section are not broken.
_**DİKKAT:** Bu bölümde listelenen kurallar, uygulamanın kararlı çalışması için temeldir. Kod yöneticisi (kullanıcı) onayı olmadan bu kurallar değiştirilemez. Tüm yeni geliştirmeler, bu bölümdeki kuralların bozulmadığı kontrol edilerek yapılmalıdır._

#### English Core Rules
1.  **AI Pre-development Check:** Before starting any development, the AI must first review the `app-rules.md` file to understand all existing rules and the current state of the project.
2.  **AI Task & Suggestion Protocol:** The AI must check `plans.md` for planned tasks. If the file is empty and there are no user instructions, the AI should proactively suggest new features or improvements in the chat.
3.  **Editable & Movable Text Elements:** Text generated on the canvas is treated as an independent element. Each text block can be moved, resized, and its content can be edited directly on the canvas.
4.  **Generate from Scratch:** Every time the "Generate" button is clicked, all existing designs/elements must be cleared (`setDesigns([])` or `setElements([])`), and a completely new set of elements must be created from scratch using the inputs (title and text).
5.  **Dynamic Slide Generation:** The number of generated images (slides) is not fixed. It dynamically increases based on the length of the input text until all text is placed.
6.  **Flexible Line Limit (12-14 lines):** Each image (slide) should generally not exceed 12 lines. However, to avoid awkwardly splitting a sentence, if the remaining part of the sentence (e.g., 1 or 2 words) can fit, the current slide can be extended up to a maximum of 14 lines to keep the sentence intact. This is a strict rule enforced by the code.
7.  **No Overflow:** The body text must always remain **inside** its designated text box element on the canvas. The text must **never** overflow vertically.
8.  **Automatic Title Logic:** If the user has not specified a title, the first sentence of the entered text is automatically used as the title. In this case, this sentence used as the title **must be removed** from the beginning of the main text.
9.  **Paragraph & Newline Preservation:** Paragraphs, newlines, and casing (uppercase/lowercase) entered by the user in the text area must be preserved and reflected in the final designs.
10. **Unified Layout & Carousel Behavior:** On all screen sizes, the control panel and the design preview area are displayed one below the other. The carousel navigation (slider arrows) must only affect the design previews, while the control panel below it remains static.
11. **Initial View:** The main content input area should be vertically centered on the screen. The "Designs" section should be hidden by default and only appear after content generation.
12. **Vertical Sizing:** The header should have a height of `5vh`, and the main content area should have a height of `95vh`.
13. **Mobile View Definition:** The "Mobile View" is the layout that applies when the browser window width is less than 768px.
14. **Case Preservation**: The casing (uppercase/lowercase) of the user's input text, including the title, must be preserved in the final design. Text should not be automatically converted to uppercase.

#### Türkçe Çekirdek Kurallar
1.  **Sen Kodlama yapan Yapay Zeka için Geliştirme Öncesi Kontrol:** Yapay zeka (sen), herhangi bir geliştirmeye başlamadan önce, mevcut tüm kuralları ve projenin mevcut durumunu anlamak için `app-rules.md` dosyasını gözden geçirmelidir.
2.  **Yapay Zeka Görev ve Öneri Protokolü:** Yapay zeka, planlanan görevler için `plans.md` dosyasını kontrol etmelidir. Eğer dosya boşsa ve kullanıcıdan bir talimat yoksa, yapay zeka sohbette proaktif olarak yeni özellikler veya iyileştirmeler önermelidir.
3.  **Düzenlenebilir ve Taşınabilir Metin Elementleri:** Kanvas üzerinde oluşturulan metin, bağımsız bir element olarak kabul edilir. Her metin bloğu taşınabilir, yeniden boyutlandırılabilir ve içeriği doğrudan kanvas üzerinde düzenlenebilir.
4.  **Sıfırdan Oluşturma:** "Oluştur" butonuna her tıklandığında, mevcut tüm tasarımlar/elementler temizlenmeli (`setDesigns([])` veya `setElements([])`) ve girdiler (başlık ve metin) kullanılarak tamamen yeni bir element seti sıfırdan oluşturulmalıdır.
5.  **Dinamik Slayt Oluşturma:** Oluşturulan görsel (slayt) sayısı sabit değildir. Girilen metnin uzunluğuna göre, tüm metin yerleştirilene kadar dinamik olarak artar.
6.  **Esnek Satır Limiti (12-14 satır):** Her bir görsel (slayt) genellikle 12 satırı geçmemelidir. Ancak, bir cümlenin anlamsız bir yerde bölünmesini önlemek amacıyla, eğer cümlenin geri kalan kısmı (örneğin 1-2 kelime) sığıyorsa mevcut slayt cümleyi bir arada tutmak için en fazla 14 satıra kadar uzatılabilir. Bu, kod tarafından uygulanan katı bir kuraldır.
7.  **Taşma Engeli:** Gövde metni, her zaman kanvas üzerindeki kendisine ait metin kutusu elementinin **içinde kalmalıdır**. Metin, dikey olarak **asla taşmamalıdır**.
8.  **Otomatik Başlık Mantığı:** Kullanıcı bir başlık belirtmemişse, girilen metnin ilk cümlesi otomatik olarak başlık olarak kullanılır. Bu durumda, başlık olarak kullanılan bu cümle ana metnin başından **kesinlikle çıkarılmalıdır**.
9.  **Paragraf, Satır Başı ve Harf Büyüklüğü Koruma:** Kullanıcının metin alanına girdiği paragraflar, satır başları ve harf büyüklüğü (büyük/küçük harf) korunmalı ve oluşturulan tasarımlara aynen yansıtılmalıdır.
10. **Birleşik Yerleşim ve Karusel Davranışı:** Tüm ekran boyutlarında, kontrol paneli ve tasarım önizleme alanı alt alta görüntülenmelidir. Karusel navigasyonu (kaydırma okları) sadece tasarım önizlemelerini etkilemeli, altındaki kontrol paneli ise sabit kalmalıdır.
11. **Başlangıç Görünümü:** Ana içerik giriş alanı ekranın dikeyinde ortalanmalıdır. "Designs" bölümü varsayılan olarak gizli olmalı ve yalnızca içerik oluşturulduktan sonra görünmelidir.
12. **Dikey Boyutlandırma:** Header `5vh` yüksekliğe, ana içerik alanı ise `95vh` yüksekliğe sahip olmalıdır.
13. **Mobil Görünüm Tanımı:** "Mobil Görünüm", tarayıcı pencere genişliği 768 pikselden daha küçük olduğunda geçerli olan düzendir.
14. **Harf Büyüklüğü Koruma**: Kullanıcının girdiği metnin (başlık dahil) büyük/küçük harf durumu, nihai tasarımda korunmalıdır. Metin otomatik olarak büyük harfe çevrilmemelidir.

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
