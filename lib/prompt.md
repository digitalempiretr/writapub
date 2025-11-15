### **Prompt: Building "Writa" - A Text-to-Image Carousel Generator**

#### **1. High-Level Concept**

Build a web application called "Writa" that allows users to input text (like a blog post, a thread, or notes) and automatically converts it into a series of visually appealing, shareable images, perfectly formatted for social media carousels (e.g., Instagram, LinkedIn). The application should handle all the complex formatting, splitting the text intelligently across multiple slides.

#### **2. Core Functionality**

1.  **Input:** The user provides two main inputs:
    *   **Title (Optional):** A title for the carousel.
    *   **Body Text:** The main content.
2.  **Generation Logic:**
    *   When the "Generate" button is clicked, the application processes the entire text.
    *   It intelligently divides the body text into multiple "slides" or "canvases."
    *   **Automatic Titling:** If the user does not provide a title, the first sentence of the body text is automatically used as the title, and this sentence is removed from the body content.
    *   **Line & Slide Management:** Each slide must contain a maximum of 12 lines. However, to avoid breaking a sentence awkwardly, if the last sentence would only leave 1-2 words for the next slide, the current slide's line limit can be extended to 14 lines to keep the sentence whole.
    *   **No Overflow:** The text must *never* overflow its designated text box on the canvas. Text must wrap automatically.
    *   **Format Preservation:** Paragraphs and newlines entered by the user must be preserved in the final output.
3.  **Output:** The application displays a preview of all the generated image slides, which the user can then review and eventually download.

#### **3. User Interface (UI) & Customization**

The UI should be clean, intuitive, and responsive, featuring a two-panel layout on desktop.

*   **Left Panel (Controls - `~40% width, sticky`):**
    *   **Content Tab:** Text areas for the title and body text, and the "Generate" button.
    *   **Design Tab:**
        *   **Background:** Options to select a solid color, a predefined gradient, or an image from a library as the canvas background.
        *   **Text Box Settings:** Controls to change the background color and opacity of the box containing the text.
        *   **Font Settings:**
            *   A dropdown to select a Google Font (must include `latin-ext` for character support).
            *   Each font in the dropdown should be previewed in its own style.
            *   Controls for text color and alignment (left, center, right).

*   **Right Panel (Preview - `~60% width`):**
    *   Displays the generated carousel slides one below the other for the user to preview.

*   **Mobile View:** On smaller screens, the Control and Preview panels should stack vertically.

#### **4. Technical Stack**

*   **Frontend:** Next.js, React, TypeScript
*   **Styling:** Tailwind CSS
*   **Canvas Rendering:** Use HTML Canvas to generate the final images.

---

### **İstem: "Writa" Uygulamasını Geliştirme - Metinden Görsel Karusel Oluşturucu**

#### **1. Genel Konsept**

Kullanıcıların metin (blog yazısı, tweet serisi veya notlar gibi) girmesine olanak tanıyan ve bu metni otomatik olarak sosyal medya karuselleri (örn. Instagram, LinkedIn) için mükemmel formatlanmış, görsel olarak çekici bir dizi resme dönüştüren "Writa" adında bir web uygulaması oluşturun. Uygulama, metni akıllıca birden fazla slayta bölerek tüm karmaşık biçimlendirme işlemlerini kendisi yapmalıdır.

#### **2. Temel İşlevsellik**

1.  **Girdi:** Kullanıcı iki ana girdi sağlar:
    *   **Başlık (İsteğe Bağlı):** Karusel için bir başlık.
    *   **Ana Metin:** Esas içerik.
2.  **Oluşturma Mantığı:**
    *   "Oluştur" butonuna tıklandığında, uygulama tüm metni işler.
    *   Ana metni akıllıca birden çok "slayt" veya "kanvasa" böler.
    *   **Otomatik Başlık:** Kullanıcı bir başlık belirtmezse, ana metnin ilk cümlesi otomatik olarak başlık olarak kullanılır ve bu cümle ana metinden kaldırılır.
    *   **Satır ve Slayt Yönetimi:** Her slayt en fazla 12 satır içermelidir. Ancak, bir cümlenin anlamsız bir yerde bölünmesini önlemek için, eğer son cümle bir sonraki slayta sadece 1-2 kelime bırakacaksa, mevcut slaydın satır limiti cümleyi bütün tutmak için 14'e kadar uzatılabilir.
    *   **Taşma Engeli:** Metin, kanvas üzerindeki metin kutusundan *asla* taşmamalıdır. Metin otomatik olarak alt satıra kaymalıdır.
    *   **Biçim Koruması:** Kullanıcının girdiği paragraflar ve satır başları nihai çıktıda korunmalıdır.
3.  **Çıktı:** Uygulama, oluşturulan tüm görsel slaytların bir önizlemesini gösterir. Kullanıcı bu slaytları inceleyebilir ve nihayetinde indirebilir.

#### **3. Kullanıcı Arayüzü (UI) & Özelleştirme**

Kullanıcı arayüzü temiz, sezgisel ve duyarlı olmalı ve masaüstünde iki panelli bir düzene sahip olmalıdır.

*   **Sol Panel (Kontroller - `~%40 genişlik, yapışkan`):**
    *   **İçerik Sekmesi:** Başlık ve ana metin için metin alanları ve "Oluştur" butonu.
    *   **Tasarım Sekmesi:**
        *   **Arka Plan:** Kanvas arka planı olarak düz bir renk, önceden tanımlanmış bir gradyan veya bir kütüphaneden bir görsel seçme seçenekleri.
        *   **Metin Kutusu Ayarları:** Metni içeren kutunun arka plan rengini ve şeffaflığını değiştirmek için kontroller.
        *   **Yazı Tipi Ayarları:**
            *   Bir Google Fontu seçmek için bir açılır menü (karakter desteği için `latin-ext` içermelidir).
            *   Açılır menüdeki her font, kendi stilinde önizlenmelidir.
            *   Metin rengi ve hizalama (sol, orta, sağ) için kontroller.

*   **Sağ Panel (Önizleme - `~%60 genişlik`):**
    *   Kullanıcının önizlemesi için oluşturulan karusel slaytlarını alt alta gösterir.

*   **Mobil Görünüm:** Daha küçük ekranlarda, Kontrol ve Önizleme panelleri dikey olarak alt alta gelmelidir.

#### **4. Teknolojik Altyapı**

*   **Frontend:** Next.js, React, TypeScript
*   **Stil (Styling):** Tailwind CSS
*   **Kanvas Oluşturma (Rendering):** Nihai görselleri oluşturmak için HTML Canvas kullanın.
