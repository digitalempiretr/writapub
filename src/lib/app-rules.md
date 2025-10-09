# Writa - Application Rules & Logic (Uygulama Kuralları ve İşleyişi)

This document outlines the core rules, logic, and version history of the Writa application. All future development must adhere to these rules, and changes will be documented under a new version number at the top of this file.
_Bu belge, Writa uygulamasının temel kurallarını, işleyişini ve sürüm geçmişini içerir. Gelecekteki tüm geliştirmeler bu kurallara uygun olmalı ve yapılan değişiklikler dosyanın en üstüne yeni bir sürüm numarası ile belgelenmelidir._

---

---

# Version History (Sürüm Geçmişi)

_New versions will be added to the top of this section._
_Yeni sürümler bu bölümün en üstüne eklenecektir._

---

## Version V1.21

#### ENGLISH
### 1. UI & Feature Enhancements
-   **Tabbed Design Templates:** The "Design Templates" panel has been reorganized with a tabbed interface to improve organization and user experience.
    -   **"Templates" Tab:** This tab now exclusively displays design templates that feature an image background.
    -   **"Styles" Tab:** This new tab is dedicated to displaying design templates that use a solid color background.
-   This separation makes it easier for users to find the type of pre-made design they are looking for.

#### TURKCE
### 1. Arayüz ve Özellik Geliştirmeleri
-   **Sekmeli Tasarım Şablonları:** "Tasarım Şablonları" paneli, organizasyonu ve kullanıcı deneyimini iyileştirmek için sekmeli bir arayüzle yeniden düzenlendi.
    -   **"Templates" (Şablonlar) Sekmesi:** Bu sekme artık yalnızca resim arka planına sahip tasarım şablonlarını görüntülüyor.
    -   **"Styles" (Stiller) Sekmesi:** Bu yeni sekme, düz renkli bir arka plan kullanan tasarım şablonlarını görüntülemek için ayrılmıştır.
-   Bu ayrım, kullanıcıların aradıkları hazır tasarım türünü daha kolay bulmalarını sağlar.

## Version V1.20

#### ENGLISH
### 1. Core Logic & Bug Fixes
-   **Background Selection Logic Overhaul:** Fixed a major UX issue where the design's background would change automatically when switching between the "Solid Color," "Gradient," and "Image" tabs. The logic was rewritten to ensure the background only updates when a user *explicitly selects* an item (a color, gradient, or image), not just by browsing tabs. This was achieved by separating the UI state (`backgroundTab`) from the design's active background type state (`backgroundType`).
-   **"Tabs must be used within Tabs" Error Fixed:** Resolved a critical runtime error on mobile devices caused by the `TabsList` component being rendered outside of its parent `Tabs` context. The component structure was refactored to ensure the entire settings panel, including the list and content, is always wrapped by the main `Tabs` provider, stabilizing the tab functionality across all views.
-   **Case Preservation Bug Fix:** Fixed a bug where title text was being automatically converted to uppercase. The logic in `image-canvas.tsx` was corrected to ensure user-entered casing is always preserved unless the "Uppercase" option is explicitly toggled on.

### 2. New Features & UI Enhancements
-   **Bold & Uppercase Text Controls:** Added two new icon buttons to the "Text Settings" tab:
    -   **Bold:** Allows users to toggle a bold font weight for the text.
    -   **Uppercase:** Allows users to convert all text to uppercase or revert to the original casing with a single click.
-   **Greatly Expanded Font Library:** Added **41** new decorative, script, and display Google Fonts (including Poppins, Lexend Deca, Ribeye Marrow, etc.) to provide users with a much wider range of typographic styles.
-   **Wider Color Palettes:** The carousels for predefined solid colors in both the "Background" and "Text" settings now display 7 color swatches at a time (up from 4), making it easier to browse and select colors quickly.
-   **Dynamic Template Previews:** If a template does not have a `previewImage` URL, a dynamic preview is generated on the card using the template's own background and font styles. This ensures all templates have a visual representation.

#### TURKCE
### 1. Çekirdek Mantık ve Hata Düzeltmeleri
-   **Arka Plan Seçim Mantığı Yeniden Yapılandırıldı:** Tasarımın arka planının "Düz Renk," "Gradyan," ve "Görsel" sekmeleri arasında geçiş yapıldığında otomatik olarak değişmesine neden olan önemli bir kullanıcı deneyimi sorunu düzeltildi. Mantık, arka planın sadece sekmelere göz atarak değil, kullanıcı bir öğeyi (renk, gradyan veya görsel) *açıkça seçtiğinde* güncellenmesini sağlayacak şekilde yeniden yazıldı. Bu, arayüz durumunu (`backgroundTab`) tasarımın aktif arka plan türü durumundan (`backgroundType`) ayırarak başarıldı.
-   **"Tabs must be used within Tabs" Hatası Düzeltildi:** Mobil cihazlarda `TabsList` bileşeninin `Tabs` ana bileşeni dışında render edilmesinden kaynaklanan kritik bir çalışma zamanı hatası çözüldü. Bileşen yapısı, liste ve içerik dahil tüm ayarlar panelinin her zaman ana `Tabs` sağlayıcısı tarafından sarmalanmasını sağlayacak şekilde yeniden düzenlendi ve sekme işlevselliği tüm görünümlerde stabilize edildi.
-   **Harf Büyüklüğü Koruma Hatası Düzeltildi:** Başlık metninin otomatik olarak büyük harfe dönüştürülmesine neden olan bir hata düzeltildi. `image-canvas.tsx` dosyasındaki mantık, "Büyük Harf" seçeneği açıkça etkinleştirilmedikçe kullanıcının girdiği harf büyüklüğünün her zaman korunmasını sağlayacak şekilde düzeltildi.

### 2. Yeni Özellikler ve Arayüz Geliştirmeleri
-   **Kalın ve Büyük Harf Metin Kontrolleri:** "Metin Ayarları" sekmesine iki yeni ikon butonu eklendi:
    -   **Kalın:** Kullanıcıların metin için kalın bir yazı tipi ağırlığı arasında geçiş yapmasını sağlar.
    -   **Büyük Harf:** Kullanıcıların tüm metni tek bir tıklama ile büyük harfe dönüştürmesine veya orijinal harf durumuna geri dönmesine olanak tanır.
-   **Büyük Ölçüde Genişletilmiş Font Kütüphanesi:** Kullanıcılara çok daha geniş bir tipografik stil yelpazesi sunmak için **41** yeni dekoratif, el yazısı ve ekran Google Fontu (Poppins, Lexend Deca, Ribeye Marrow vb. dahil) eklendi.
-   **Daha Geniş Renk Paletleri:** Hem "Arka Plan" hem de "Metin" ayarlarındaki önceden tanımlanmış düz renkler için olan karuseller, artık aynı anda 4 yerine 7 renk örneği göstererek renklere hızlıca göz atmayı ve seçmeyi kolaylaştırıyor.
-   **Dinamik Şablon Önizlemeleri:** Eğer bir şablonun `previewImage` URL'si yoksa, şablonun kendi arka plan ve yazı tipi stilleri kullanılarak kart üzerinde dinamik bir önizleme oluşturulur. Bu, tüm şablonların görsel bir temsile sahip olmasını sağlar.

## Version V1.19

#### ENGLISH
### 1. UI & Feature Enhancements
-   **Dynamic Template Previews:** The static preview images for the default "Design Templates" have been replaced with dynamically generated previews. The `previewImage` for each template is now created using the actual template settings, ensuring the thumbnail accurately reflects how the design will look when applied. This provides a more consistent and informative user experience, mirroring the functionality of the "My Designs" feature.
-   **Expanded Template Library:** Added three new design templates to give users more creative options:
    -   **"Minimalist Black":** A clean, high-contrast template with a solid black background and white text.
    -   **"Sunrise Gradient":** A warm, inviting template featuring a soft peach-toned gradient.
    -   **"Oceanic Blue":** A professional-looking template with a solid blue background and an opaque, light-colored text box.
-   **Expanded Font Library:** Added 19 new decorative, script, and display Google Fonts (including Cherry Bomb One, Mea Culpa, Grand Hotel, etc.) to provide users with a much wider range of typographic styles.
-   **Carousel Display Update:** The carousels for both "Design Templates" and "My Designs" have been updated to display 4 items at a time on all screen sizes (mobile and desktop), allowing users to see more options at once.
-   **Bug Fix: Text Case Preservation:** Fixed a bug where the title text was being automatically converted to uppercase. The `.toLocaleUpperCase()` method was removed from the text rendering function, ensuring that text in the design now perfectly matches the casing entered by the user.

#### TURKCE
### 1. Arayüz ve Özellik Geliştirmeleri
-   **Dinamik Şablon Önizlemeleri:** Varsayılan "Tasarım Şablonları" için kullanılan statik önizleme görselleri, dinamik olarak oluşturulan önizlemelerle değiştirildi. Artık her şablonun `previewImage` özelliği, şablonun gerçek ayarları kullanılarak oluşturuluyor. Bu, küçük resmin, şablon uygulandığında nasıl görüneceğini doğru bir şekilde yansıtmasını sağlayarak "Tasarımlarım" özelliğinin işlevselliğini kopyalayan daha tutarlı ve bilgilendirici bir kullanıcı deneyimi sunar.
-   **Genişletilmiş Şablon Kütüphanesi:** Kullanıcılara daha fazla yaratıcı seçenek sunmak için üç yeni tasarım şablonu eklendi:
    -   **"Minimalist Black":** Düz siyah arka plan ve beyaz metin ile temiz, yüksek kontrastlı bir şablon.
    -   **"Sunrise Gradient":** Yumuşak şeftali tonlarında bir gradyana sahip, sıcak ve davetkar bir şablon.
    -   **"Oceanic Blue":** Düz mavi bir arka plana ve opak, açık renkli bir metin kutusuna sahip, profesyonel görünümlü bir şablon.
-   **Genişletilmiş Font Kütüphanesi:** Kullanıcılara çok daha geniş bir tipografik stil yelpazesi sunmak için 19 yeni dekoratif, el yazısı ve ekran Google Fontu (Cherry Bomb One, Mea Culpa, Grand Hotel vb. dahil) eklendi.
-   **Karusel Görünüm Güncellemesi:** Hem "Tasarım Şablonları" hem de "Tasarımlarım" karuselleri, tüm ekran boyutlarında (mobil ve masaüstü) aynı anda 4 öğe gösterecek şekilde güncellendi, bu da kullanıcıların tek seferde daha fazla seçenek görmesini sağlar.
-   **Hata Düzeltmesi: Metin Büyüklüğü Koruma:** Başlık metninin otomatik olarak büyük harfe dönüştürülmesine neden olan bir hata düzeltildi. Metin işleme fonksiyonundan `.toLocaleUpperCase()` metodu kaldırıldı, böylece tasarımdaki metin artık kullanıcının girdiği büyük/küçük harf durumunu tam olarak yansıtıyor.

## Version V1.18

#### ENGLISH
### 1. Major Bug Fix: Mobile Tab Logic Overhaul
-   **Problem:** The mobile tab panel had multiple conflicting state management issues, causing unpredictable behavior. It would often fail to open if the same tab was clicked after closing, or it would fail to switch correctly when another tab was clicked.
-   **Solution:** The entire logic for mobile tab interaction has been rewritten and simplified to be robust and predictable.
    -   **Separated Concerns:** The state for which tab is *active* (`activeSettingsTab`) and the state for whether the panel is *visible* (`isMobilePanelOpen`) are now handled separately and more clearly.
    -   **Consistent Opening:** Clicking any tab icon now reliably sets `isMobilePanelOpen` to `true`, ensuring the panel always opens when a tab is interacted with.
    -   **Dedicated Closing:** Closing the panel is now handled exclusively by the 'X' icon button and the "click outside" functionality. These actions only set `isMobilePanelOpen` to `false` without interfering with the active tab state.
    -   This change removes the previous, buggy "click the same tab to close" feature in favor of a much more stable and reliable system that meets all specified requirements.

#### TURKCE
### 1. Büyük Hata Düzeltmesi: Mobil Sekme Mantığının Yeniden Yapılandırılması
-   **Sorun:** Mobil sekme paneli, birden çok çakışan durum yönetimi sorununa sahipti ve bu da öngörülemeyen davranışlara neden oluyordu. Panel kapatıldıktan sonra aynı sekmeye tıklandığında genellikle açılmıyor veya başka bir sekmeye tıklandığında doğru şekilde geçiş yapamıyordu.
-   **Çözüm:** Mobil sekme etkileşimi için tüm mantık, sağlam ve öngörülebilir olacak şekilde yeniden yazıldı ve basitleştirildi.
    -   **Sorumlulukların Ayrılması:** Hangi sekmenin *aktif* olduğunu (`activeSettingsTab`) ve panelin *görünür* olup olmadığını (`isMobilePanelOpen`) yöneten durumlar artık ayrı ve daha net bir şekilde ele alınıyor.
    -   **Tutarlı Açılma:** Herhangi bir sekme ikonuna tıklamak artık güvenilir bir şekilde `isMobilePanelOpen` durumunu `true` olarak ayarlayarak, bir sekme ile etkileşime girildiğinde panelin her zaman açılmasını sağlar.
    -   **Özelleşmiş Kapatma:** Paneli kapatma işlemi artık yalnızca 'X' ikon butonu ve "dışarı tıklama" işlevselliği tarafından gerçekleştirilir. Bu eylemler, aktif sekme durumuna müdahale etmeden sadece `isMobilePanelOpen` durumunu `false` olarak ayarlar.
    -   Bu değişiklik, belirtilen tüm gereksinimleri karşılayan çok daha kararlı ve güvenilir bir sistem lehine, önceki hatalı "kapatmak için aynı sekmeye tıkla" özelliğini kaldırır.
---

## Version V1.17

#### ENGLISH
### 1. Bug Fixes
-   **Mobile Tab Navigation Fix:** Resolved a persistent bug in the mobile view where the settings panel would incorrectly close when the user tried to switch between different tabs (e.g., from "Designs" to "Background"). The tab switching logic has been simplified to ensure the panel remains open during navigation, providing a smoother and more predictable user experience.
-   **Module Not Found Fix:** Fixed a critical build error (`Module not found: Can't resolve '@/componentsui/slider'`) caused by an incorrect import path. The path has been corrected to `@/components/ui/slider`, allowing the application to compile and run successfully.

#### TURKCE
### 1. Hata Düzeltmeleri
-   **Mobil Sekme Geçişi Düzeltmesi:** Mobil görünümde, kullanıcı farklı sekmeler arasında (örneğin "Tasarımlar"dan "Arka Plan"a) geçiş yapmaya çalıştığında ayarlar panelinin hatalı bir şekilde kapanmasına neden olan inatçı bir hata çözüldü. Sekme geçiş mantığı, gezinme sırasında panelin açık kalmasını sağlayacak şekilde basitleştirilerek daha akıcı ve öngörülebilir bir kullanıcı deneyimi sunuldu.
-   **Modül Bulunamadı Hatası Düzeltmesi:** Yanlış bir `import` yolundan kaynaklanan ve uygulamanın derlenmesini engelleyen kritik bir derleme hatası (`Module not found: Can't resolve '@/componentsui/slider'`) düzeltildi. Dosya yolu `@/components/ui/slider` olarak düzeltilerek uygulamanın başarıyla çalışması sağlandı.

---

## Version V1.16

#### ENGLISH
### 1. New Core Feature: "My Designs"
-   **Personal Template System:** A new "My Designs" tab, represented by a star icon, has been added. This major feature allows users to save, manage, and reuse their own custom design templates.
-   **Persistent Storage:** User-created designs are saved to the browser's `localStorage`, making them persistent across sessions on the same device. A custom hook (`useLocalStorage`) was created to manage this.
-   **Saving Designs:**
    -   Users can save the current combination of background, font, and color settings as a new personal template.
    -   Saving can be initiated from two places: a "Save Current" button within the "My Designs" tab, and a star icon on the top-right of each preview in the main design carousel.
-   **Applying & Deleting:** Users can instantly apply any of their saved designs by clicking on them or delete them via a trash icon.
-   **Editing Names:** A simple editing feature has been implemented. Users can click on a design's name to enter an edit mode, rename it, and save the new name.
-   **UI Integration:** The settings panel tab list has been updated to a 5-column grid to accommodate the new "My Designs" tab.

### 2. UI & UX Improvements
-   **Toast Notification Auto-Close:** All toast notifications (e.g., "Template Applied," "Design Saved") now automatically close after 2 seconds for a smoother user experience.
-   **Carousel Display Update:** The carousels for both "Design Templates" and "My Designs" have been updated to display 4 items at a time on desktop screens, allowing users to see more options at once.
-   **Tooltip Provider Fix:** A runtime error (`Tooltip must be used within TooltipProvider`) was fixed by correctly wrapping the settings panel and its components, ensuring all tooltips in the application function correctly.

#### TURKCE
### 1. Yeni Ana Özellik: "My Designs" (Tasarımlarım)
-   **Kişisel Şablon Sistemi:** Ayarlar paneline yıldız ikonuyla temsil edilen yeni bir "My Designs" sekmesi eklendi. Bu ana özellik, kullanıcıların kendi özel tasarım şablonlarını kaydetmelerine, yönetmelerine ve yeniden kullanmalarına olanak tanır.
-   **Kalıcı Depolama:** Kullanıcı tarafından oluşturulan tasarımlar, tarayıcının `localStorage`'ına kaydedilir, bu da tasarımların aynı cihazdaki oturumlar arasında kalıcı olmasını sağlar. Bu yönetimi sağlamak için `useLocalStorage` adında özel bir hook oluşturulmuştur.
-   **Tasarım Kaydetme:**
    -   Kullanıcılar mevcut arka plan, yazı tipi ve renk ayarları kombinasyonunu yeni bir kişisel şablon olarak kaydedebilirler.
    -   Kaydetme işlemi iki yerden başlatılabilir: "My Designs" sekmesi içindeki "Mevcut Tasarımı Kaydet" butonu ve ana tasarım karuselindeki her bir önizlemenin sağ üst köşesindeki yıldız ikonu.
-   **Uygulama ve Silme:** Kullanıcılar, kaydettikleri tasarımlardan herhangi birine tıklayarak anında uygulayabilir veya bir çöp kutusu ikonu aracılığıyla silebilirler.
-   **İsim Düzenleme:** Basit bir düzenleme özelliği eklendi. Kullanıcılar bir tasarımın adına tıklayarak düzenleme moduna geçebilir, onu yeniden adlandırabilir ve yeni adı kaydedebilirler.
-   **Arayüz Entegrasyonu:** Ayarlar paneli sekme listesi, yeni "My Designs" sekmesini barındırmak için 5 sütunlu bir grid yapısına güncellendi.

### 2. Arayüz ve Kullanıcı Deneyimi İyileştirmeleri
-   **Bildirimlerin Otomatik Kapanması:** "Şablon Uygulandı," "Tasarım Kaydedildi" gibi tüm bildirimler (toast), daha akıcı bir kullanıcı deneyimi için artık 2 saniye sonra otomatik olarak kapanmaktadır.
-   **Karusel Görüntüleme Güncellemesi:** Hem "Tasarım Şablonları" hem de "Tasarımlarım" karuselleri, masaüstü ekranlarda aynı anda 4 öğe gösterecek şekilde güncellenerek kullanıcıların tek seferde daha fazla seçenek görmesi sağlandı.
-   **Araç İpucu Sağlayıcı Hatası Düzeltmesi:** Bir çalışma zamanı hatası (`Tooltip must be used within TooltipProvider`) ayarlar panelini ve bileşenlerini doğru şekilde sarmalayarak düzeltildi ve uygulamadaki tüm araç ipuçlarının (tooltip) düzgün çalışması sağlandı.

---

## Version V1.15

#### ENGLISH
### 1. New Features & UI Enhancements
-   **Design Templates:** A new "Designs" tab has been added to the settings panel. This tab features a carousel of ready-made design templates.
-   **One-Click Application:** Users can now click on a template to instantly apply a full set of pre-configured design settings, including background (solid, gradient, or image), font, text color, text box color/opacity, and background overlay color/opacity. This allows for rapid and visually consistent design creation.
-   **Template Data Structure:** A new file, `src/lib/design-templates.ts`, has been created to define and manage the data for all design templates, keeping the main component clean.
-   **UI Update:** The settings panel tab list has been updated to a 4-column grid to accommodate the new "Designs" tab, which is now the first tab.

#### TURKCE
### 1. Yeni Özellikler ve Arayüz Geliştirmeleri
-   **Tasarım Şablonları:** Ayarlar paneline yeni bir "Designs" (Tasarımlar) sekmesi eklendi. Bu sekme, hazır tasarım şablonlarından oluşan bir karusel içerir.
-   **Tek Tıkla Uygulama:** Kullanıcılar artık bir şablona tıklayarak arka plan (düz renk, gradyan veya görsel), yazı tipi, metin rengi, metin kutusu rengi/opaklığı ve arka plan kaplaması rengi/opaklığı dahil olmak üzere önceden yapılandırılmış bir dizi tasarım ayarını anında uygulayabilir. Bu, hızlı ve görsel olarak tutarlı tasarım oluşturmayı sağlar.
-   **Şablon Veri Yapısı:** Tüm tasarım şablonlarının verilerini tanımlamak ve yönetmek için yeni bir dosya olan `src/lib/design-templates.ts` oluşturuldu. Bu, ana bileşeni temiz tutar.
-   **Arayüz Güncellemesi:** Ayarlar paneli sekme listesi, artık ilk sekme olan yeni "Designs" sekmesini barındırmak için 4 sütunlu bir grid yapısına güncellendi.

---

## Version V1.14

#### ENGLISH
### 1. UI & Feature Updates
-   **"Feel Lucky" Button Repositioned:** The "Feel Lucky" button has been moved to be directly next to the image search bar. This groups the primary search-related actions (specific search and random search) together for a more intuitive user experience.
-   **"Feel Lucky" Button Style Update:** The button has been updated to include both the dice icon and the "Feel Lucky" text, making its purpose clearer to the user at a glance.

#### TURKCE
### 1. Arayüz ve Özellik Güncellemeleri
-   **"Kendimi Şanslı Hissediyorum" Butonu Yeniden Konumlandırıldı:** "Kendimi Şanslı Hissediyorum" butonu, görsel arama çubuğunun hemen yanına taşındı. Bu, aramayla ilgili ana eylemleri (belirli arama ve rastgele arama) daha sezgisel bir kullanıcı deneyimi için bir araya getirir.
-   **"Kendimi Şanslı Hissediyorum" Buton Stili Güncellemesi:** Buton, hem zar ikonunu hem de "Kendimi Şanslı Hissediyorum" metnini içerecek şekilde güncellenerek amacının bir bakışta daha net anlaşılması sağlandı.

---

## Version V1.13

#### ENGLISH
### 1. Major Bug Fixes & UI Enhancements
-   **Color Picker Interaction Fixed:** A persistent and critical bug where the native color picker would not open or would close immediately has been definitively resolved. The complex component wrappers (`Popover`, `DropdownMenu`) were removed. The solution now uses a standard and reliable HTML/CSS technique: a visually hidden `<Input type="color">` is positioned directly over its corresponding icon/swatch, ensuring clicks are correctly handled by the browser.
-   **Dynamic Icon Colors:** Color picker icons now dynamically change their color to match the currently selected color, providing immediate visual feedback to the user.
-   **Comprehensive Accessibility Fixes:** All "duplicate id" and "no label associated" console errors have been eliminated. This was achieved by programmatically generating unique IDs for all form elements using the `useId` hook and correctly associating them with their `<Label>` components via the `htmlFor` attribute.
-   **Carousel Performance Optimization:** A major performance issue causing a "refresh" effect on every carousel scroll has been fixed. The `renderCanvas` function is now memoized with `useCallback`. This prevents unnecessary re-renders of the canvas images during scrolling, making the interaction smooth and fluid. The carousel now feels significantly more responsive.
-   **Carousel "Free-Drag" Mode:** The `dragFree: true` option has been enabled for all carousels. This allows the carousel to slide with momentum after a swipe, creating a much more modern and satisfying "buttery smooth" scrolling experience.

### 2. New Features & UX Improvements
-   **Custom File Name for Downloads:** A text input field has been added to the "Download" tab, allowing users to specify a custom base name for their downloaded designs. Files are now saved as `[custom-name]-[slide-number].jpg`, or "writa-1.jpg" if no name is provided.
-   **Text Color Palette:** A pre-defined color swatch carousel, identical to the one for background colors, has been added to the "Text Settings" tab, allowing for quick selection of text colors.
-   **Auto-Scroll on Image Search:** When the "More" button is clicked in the image search results, the carousel now automatically scrolls to bring the newly loaded images into view.
-   **Mobile UX - Scrollable Settings:** In mobile view (under 767px), the "Background" settings panel is now vertically scrollable if its content exceeds the screen height.
-   **Mobile UX - Click Outside to Close:** In mobile view, the settings panel now automatically closes when the user taps anywhere outside of the panel area, providing a more intuitive navigation experience.

### 3. Code Refactoring
-   **Centralized Color Management:** All color definitions (palettes, default colors, gradients) have been moved from `page.tsx` into a new, dedicated `src/lib/colors.ts` file. This centralizes theme management and makes future style updates easier and more consistent.

#### TURKCE
### 1. Büyük Hata Düzeltmeleri ve Arayüz Geliştirmeleri
-   **Renk Seçici Etkileşim Hatası Düzeltildi:** Tarayıcının yerel renk seçicisinin açılmamasına veya hemen kapanmasına neden olan inatçı ve kritik bir hata kesin olarak çözüldü. Karmaşık bileşen sarmalayıcıları (`Popover`, `DropdownMenu`) kaldırıldı. Çözüm artık standart ve güvenilir bir HTML/CSS tekniği kullanıyor: görsel olarak gizlenmiş bir `<Input type="color">` elemanı, ilgili ikonun/renk kutusunun tam üzerine konumlandırılarak tıklamaların tarayıcı tarafından doğru şekilde işlenmesi sağlandı.
-   **Dinamik İkon Renkleri:** Renk seçici ikonları, artık seçili olan rengi yansıtacak şekilde dinamik olarak renk değiştirerek kullanıcıya anında görsel geri bildirim sağlıyor.
-   **Kapsamlı Erişilebilirlik Düzeltmeleri:** Konsoldaki tüm "duplicate id" ve "no label associated" hataları giderildi. Bu, `useId` hook'u kullanılarak tüm form elemanları için programatik olarak benzersiz ID'ler oluşturarak ve bunları `htmlFor` özelliği aracılığıyla `<Label>` bileşenleriyle doğru şekilde ilişkilendirerek başarıldı.
-   **Karusel Performans Optimizasyonu:** Karuselin her kaydırılmasında "yenileme" efektine neden olan büyük bir performans sorunu düzeltildi. `renderCanvas` fonksiyonu artık `useCallback` ile hafızaya alınıyor. Bu, kaydırma sırasında kanvas görsellerinin gereksiz yere yeniden çizilmesini engelleyerek etkileşimi akıcı hale getiriyor. Karusel artık belirgin şekilde daha hızlı ve tepkisel.
-   **Karusel "Serbest Kaydırma" Modu:** Tüm karuseller için `dragFree: true` seçeneği etkinleştirildi. Bu, karuselin bir kaydırma hareketinden sonra momentumla kaymaya devam etmesini sağlayarak çok daha modern ve tatmin edici, "yağ gibi akan" bir kaydırma deneyimi yaratır.

### 2. Yeni Özellikler ve Kullanıcı Deneyimi İyileştirmeleri
-   **İndirmeler için Özel Dosya Adı:** "İndir" sekmesine, kullanıcıların indirdikleri tasarımlar için özel bir temel ad belirtmelerine olanak tanıyan bir metin giriş alanı eklendi. Dosyalar artık `[ozel-ad]-[slayt-numarasi].jpg` olarak veya bir ad belirtilmezse "writa-1.jpg" olarak kaydediliyor.
-   **Metin Rengi Paleti:** Arka plan renkleri için kullanılanın aynısı olan, önceden tanımlanmış bir renk paleti karuseli, metin renklerinin hızlıca seçilmesini sağlamak için "Metin Ayarları" sekmesine eklendi.
-   **Görsel Aramada Otomatik Kaydırma:** Görsel arama sonuçlarında "Daha Fazla" butonuna tıklandığında, karusel artık yeni yüklenen görselleri görüntü alanına getirmek için otomatik olarak kaydırılıyor.
-   **Mobil UX - Kaydırılabilir Ayarlar:** Mobil görünümde (767px altı), "Arka Plan" ayarları panelinin içeriği ekran yüksekliğini aştığında artık dikey olarak kaydırılabiliyor.
-   **Mobil UX - Dışarı Tıklayarak Kapatma:** Mobil görünümde, ayarlar paneli artık kullanıcı panel alanının dışındaki herhangi bir yere dokunduğunda otomatik olarak kapanarak daha sezgisel bir gezinme deneyimi sunuyor.

### 3. Kod Yeniden Yapılandırması
-   **Merkezi Renk Yönetimi:** Tüm renk tanımlamaları (paletler, varsayılan renkler, gradyanlar) `page.tsx` dosyasından yeni ve özel bir `src/lib/colors.ts` dosyasına taşındı. Bu, tema yönetimini merkezileştirir ve gelecekteki stil güncellemelerini daha kolay ve tutarlı hale getirir.

---

## Version V1.12

#### ENGLISH
### 1. Bug Fixes & UI Improvements
-   **Color Picker Fix (Final):** Resolved a persistent bug where the browser's native color picker would immediately close upon interaction. The problematic `Popover` and `DropdownMenu` wrappers have been completely removed. The fix was implemented by placing a visually hidden `<Input type="color">` directly over the clickable icon/swatch using relative and absolute positioning. This standard HTML/CSS technique ensures that clicking the icon directly and reliably opens the native color palette without any interference from other components. This solution has been applied to all color pickers in the application.
-   **Dynamic Icon Color:** The color picker icons (`TextColorChooseIcon`, `BgOverlayIcon`, `TextBgBoxIcon`) now dynamically update to reflect the currently selected color. This provides immediate visual feedback to the user.
-   **Accessibility Fixes:** Corrected multiple accessibility issues reported by the browser console. All form fields (`Input`, `Textarea`, `Slider`) are now properly associated with their corresponding `<Label>` elements using unique `id` and `htmlFor` attributes, eliminating "duplicate id" and "no label associated" errors.

#### TURKCE
### 1. Hata Düzeltmeleri ve Arayüz İyileştirmeleri
-   **Renk Seçici Hatası (Nihai Çözüm):** Tarayıcının yerel renk seçicisinin etkileşim anında hemen kapanmasına neden olan inatçı bir hata çözüldü. Sorunlu `Popover` ve `DropdownMenu` sarmalayıcıları tamamen kaldırıldı. Çözüm, görsel olarak gizlenmiş bir `<Input type="color">` elemanını, göreli ve mutlak konumlandırma kullanarak tıklanabilir ikon/renk kutusunun tam üzerine yerleştirerek uygulandı. Bu standart HTML/CSS tekniği, ikona tıklamanın, diğer bileşenlerden etkilenmeden doğrudan ve güvenilir bir şekilde yerel renk paletini açmasını sağlar. Bu çözüm, uygulamadaki tüm renk seçicilere uygulanmıştır.
-   **Dinamik İkon Rengi:** Renk seçici ikonları (`TextColorChooseIcon`, `BgOverlayIcon`, `TextBgBoxIcon`) artık seçili olan rengi yansıtacak şekilde dinamik olarak güncelleniyor. Bu, kullanıcıya anında görsel bir geri bildirim sağlar.
-   **Erişilebilirlik Düzeltmeleri:** Tarayıcı konsolunda bildirilen çok sayıda erişilebilirlik sorunu düzeltildi. Tüm form alanları (`Input`, `Textarea`, `Slider`) artık benzersiz `id` ve `htmlFor` öznitelikleri kullanılarak ilgili `<Label>` elemanlarıyla doğru bir şekilde ilişkilendirilerek "yinelenen id" ve "ilişkili etiket yok" hataları giderildi.

---

## Version V1.11

#### ENGLISH
### 1. Process & Definition Updates
-   **Mobile View Definition:** A new non-negotiable core rule has been added. "Mobile View" is now officially defined as the layout that applies when the browser window width is less than 768px. This rule is now documented and implemented in the code.

#### TURKCE
### 1. Süreç ve Tanım Güncellemeleri
-   **Mobil Görünüm Tanımı:** Değiştirilemez çekirdek kurallara yeni bir kural eklendi. "Mobil Görünüm" artık resmi olarak, tarayıcı pencere genişliği 768 pikselden daha küçük olduğunda geçerli olan düzen olarak tanımlanmıştır. Bu kural, hem dokümantasyona hem de koda işlenmiştir.

---

## Version V1.10

#### ENGLISH
### 1. UI & Feature Updates
-   **Random Background Button ("Feel Lucky"):** A button with a `Dice5` icon has been added next to the image search bar. Clicking it selects a random background image from `picsum.photos` using a stable seed, ensuring the chosen image remains consistent across re-renders.
-   **Image Search Keywords:** Five predefined keyword buttons ("Texture," "Background," "Wallpaper," "Nature," "Sea") have been added to allow users to quickly perform common image searches.
-   **Advanced Search Pagination:**
    -   Image search results are now displayed in groups of 6.
    -   A "More" button loads the next 6 images, displaying 12 in total.
    -   Subsequent clicks on "More" replace the oldest 6 images with a new set, creating a "sliding window" of the 12 most recent results.
-   **Carousel Slider Bug Fix:** Fixed a critical UI bug where the entire settings panel would slide along with the design previews. The settings panel is now separate from the carousel and remains static.
-   **UI Color Adjustments:** The background color of the settings panel has been changed to `#f4fdff` to make it opaque and visually distinct.

#### TURKCE
### 1. Arayüz ve Özellik Güncellemeleri
-   **Rastgele Arka Plan Butonu ("Kendimi Şanslı Hissediyorum"):** Görsel arama çubuğunun yanına `Dice5` (zar) ikonu içeren bir buton eklendi. Tıklandığında, `picsum.photos` servisinden rastgele bir arka plan görseli seçer. Seçilen görselin yeniden render'larda değişmemesi için sabit bir "seed" kullanılır.
-   **Görsel Arama Anahtar Kelimeleri:** Kullanıcıların yaygın aramaları hızla yapabilmesi için beş adet önceden tanımlanmış anahtar kelime butonu ("Texture," "Background," "Wallpaper," "Nature," "Sea") eklendi.
-   **Gelişmiş Arama Sayfalaması:**
    -   Görsel arama sonuçları artık 6'lı gruplar halinde gösteriliyor.
    -   "Daha Fazla" butonu sonraki 6 görseli yükleyerek toplamda 12 görsel gösterir.
    -   Sonraki tıklamalarda, en eski 6 görseli listeden çıkarıp yeni bir set ekleyerek en güncel 12 sonucu gösteren bir "kayan pencere" mantığı uygulanır.
-   **Karusel (Slider) Hata Düzeltmesi:** Tasarım ayar panelinin, görsellerle birlikte kaymasına neden olan kritik arayüz hatası düzeltildi. Ayar paneli artık karuselden bağımsızdır ve sabit kalır.
-   **Arayüz Renk Düzenlemeleri:** Ayar panelinin arka plan rengi, opak ve görsel olarak daha belirgin olması için `#f4fdff` olarak değiştirildi.

---

## Version V1.09

#### ENGLISH
### 1. UI & Layout Updates
-   **Vertical Sizing:** The header height is now fixed to `10vh` and the main content area to `90vh`, creating a full-screen vertical layout.

#### TURKCE
### 1. Arayüz ve Yerleşim Güncellemeleri
-   **Dikey Boyutlandırma:** Başlık (header) yüksekliği `10vh` ve ana içerik alanı `90vh` olarak sabitlenerek tam ekran dikey bir yerleşim oluşturuldu.

---

## Version V1.08

#### ENGLISH
### 1. UI & Layout Updates
-   **Vertically Centered Input:** The main content input area ("Creative Magic") is now vertically centered on the screen, creating a focused starting point for the user.
-   **Dynamic Design Section:** The "Designs" section is now hidden by default. It only appears after the user clicks the "Generate" button, providing a cleaner initial view and revealing the results contextually.
-   **Full-Width Header:** The header containing the logo is now full-width, independent of the main content container.
-   **Consistent Section Styling:** The "Creative Magic" and "Designs" sections now share a consistent, transparent background and heading style, removing the card-like appearance for a more integrated UI.
-   **Redesigned Generate Button:** The "Generate" text button has been replaced with a circular icon button featuring an "Arrow Up" icon. It's now positioned neatly next to the character counter.
-   **UI Polish:** The text area's border has been removed to blend it seamlessly with its background.

#### TURKCE
### 1. Arayüz ve Yerleşim Güncellemeleri
-   **Dikeyde Ortalanmış Giriş Alanı:** Ana içerik giriş alanı ("Creative Magic") artık ekranın dikeyinde ortalanarak kullanıcı için odaklanmış bir başlangıç noktası oluşturur.
-   **Dinamik Tasarım Bölümü:** "Designs" bölümü artık varsayılan olarak gizlidir. Sadece kullanıcı "Oluştur" butonuna bastıktan sonra belirerek daha temiz bir başlangıç görünümü sunar ve sonuçları bağlamsal olarak ortaya çıkarır.
-   **Tam Genişlik Başlık:** Logoyu içeren başlık (header) alanı artık ana içerik kapsayıcısından bağımsız olarak tam genişliktedir.
-   **Tutarlı Bölüm Stili:** "Creative Magic" ve "Designs" bölümleri artık daha entegre bir kullanıcı arayüzü için kart benzeri görünümü kaldıran, tutarlı, şeffaf bir arka plana ve başlık stiline sahiptir.
-   **Yeniden Tasarlanan Oluştur Butonu:** "Oluştur" metinli buton, "Yukarı Ok" ikonu içeren dairesel bir ikon buton ile değiştirildi. Artık karakter sayacının yanında düzgün bir şekilde konumlandırılmıştır.
-   **Arayüz İyileştirmeleri:** Metin alanının kenarlığı, arka planıyla sorunsuz bir şekilde bütünleşmesi için kaldırıldı.

---

## Version V1.07

#### ENGLISH
### 1. UI & Layout Updates
-   **Single-Column Layout:** The layout on all screen sizes has been unified. The two-column desktop layout (`lg:col-span-5` and `lg:col-span-7`) has been removed. Now, the control panel and the design preview area are always displayed one below the other, creating a consistent experience across all devices. The sticky positioning of the control panel has also been removed.

#### TURKCE
### 1. Arayüz ve Yerleşim Güncellemeleri
-   **Tek Sütunlu Yerleşim:** Tüm ekran boyutlarındaki yerleşim birleştirildi. İki sütunlu masaüstü düzeni (`lg:col-span-5` ve `lg:col-span-7`) kaldırıldı. Artık kontrol paneli ve tasarım önizleme alanı, tüm cihazlarda tutarlı bir deneyim yaratarak her zaman alt alta görüntüleniyor. Kontrol panelinin sabit (`sticky`) konumu da kaldırıldı.

---

## Version V1.06

#### ENGLISH
### 1. UI & Layout Updates
-   **Centralized Design Controls:** The "Background," "Text Box Settings," and "Font Settings" sections have all been moved from the left-hand control panel to the right-hand design preview panel. This places all visual customization options directly next to the carousel preview, creating a more intuitive and consolidated user workflow.

#### TURKCE
### 1. Arayüz ve Yerleşim Güncellemeleri
-   **Merkezi Tasarım Kontrolleri:** "Arka Plan," "Metin Kutusu Ayarları," ve "Yazı Tipi Ayarları" bölümlerinin tamamı sol kontrol panelinden sağdaki tasarım önizleme paneline taşındı. Bu, tüm görsel özelleştirme seçeneklerini doğrudan karusel önizlemesinin yanına yerleştirerek daha sezgisel ve birleşik bir kullanıcı iş akışı oluşturur.

---

## Version V1.05

#### ENGLISH
### 1. UI & Style Updates
-   **Background:** The application's body background has been updated with a new dark gradient (`linear-gradient(to right, #2C5364, #203A43, #0F2027)`).
-   **Logo Color:** The logo color has been changed to `#f4fdff` to ensure it stands out against the new dark background.

#### TURKCE
### 1. Arayüz ve Stil Güncellemeleri
-   **Arka Plan:** Uygulamanın gövde arka planı yeni bir koyu gradyan ile güncellendi (`linear-gradient(to right, #2C5364, #203A43, #0F2027)`).
-   **Logo Rengi:** Logo rengi, yeni koyu arka plan üzerinde öne çıkması için `#f4fdff` olarak değiştirildi.

---

## Version V1.04

#### ENGLISH
### 1. UI & Style Updates
-   **Background:** A new gradient background (`linear-gradient(to left, #fcb045, #fd1d1d, #833ab4)`) has been applied to the main body of the application.
-   **Text Area:** The text input area is now resizable by the user, allowing for a more flexible writing experience.

#### TURKCE
### 1. Arayüz ve Stil Güncellemeleri
-   **Arka Plan:** Uygulamanın ana gövdesine yeni bir gradyan arka plan (`linear-gradient(to left, #fcb045, #fd1d1d, #833ab4)`) uygulandı.
-   **Metin Alanı:** Metin giriş alanı artık kullanıcı tarafından yeniden boyutlandırılabiliyor, bu da daha esnek bir yazma deneyimi sağlıyor.

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
9.  **Paragraph & Newline Preservation:** Paragraphs, newlines, and casing (uppercase/lowercase) entered by the user in the text area must be preserved and reflected in the final designs.
10. **Unified Layout & Carousel Behavior:** On all screen sizes, the control panel and the design preview area are displayed one below the other. The carousel navigation (slider arrows) must only affect the design previews, while the control panel below it remains static.
11. **Initial View:** The main content input area should be vertically centered on the screen. The "Designs" section should be hidden by default and only appear after content generation.
12. **Vertical Sizing:** The header should have a height of `10vh`, and the main content area should have a height of `90vh`.
13. **Mobile View Definition:** The "Mobile View" is the layout that applies when the browser window width is less than 768px.
14. **Case Preservation**: The casing (uppercase/lowercase) of the user's input text, including the title, must be preserved in the final design. Text should not be automatically converted to uppercase.

#### Türkçe Çekirdek Kurallar
1.  **Yapay Zeka Geliştirme Öncesi Kontrol:** Yapay zeka, herhangi bir geliştirmeye başlamadan önce, mevcut tüm kuralları ve projenin mevcut durumunu anlamak için `app-rules.md` dosyasını gözden geçirmelidir.
2.  **Yapay Zeka Görev ve Öneri Protokolü:** Yapay zeka, planlanan görevler için `plans.md` dosyasını kontrol etmelidir. Eğer dosya boşsa ve kullanıcıdan bir talimat yoksa, yapay zeka sohbette proaktif olarak yeni özellikler veya iyileştirmeler önermelidir.
3.  **Sürüm Kontrolü:** Tamamlanan her görev veya değişiklik setinden sonra, `app-rules.md` dosyası yeni bir artan sürüm numarasıyla (örn: V1.01, V1.02) güncellenmeli ve yapılan değişiklikler o yeni sürüm altında belgelenmelidir. Tamamlanan görevler `plans.md` dosyasından silinmelidir.
4.  **Sıfırdan Oluşturma:** "Oluştur" butonuna her tıklandığında, mevcut tüm tasarımlar temizlenmeli (`setDesigns([])`) ve girdiler (başlık ve metin) kullanılarak tamamen yeni bir tasarım seti sıfırdan oluşturulmalıdır.
5.  **Dinamik Slayt Oluşturma:** Oluşturulan görsel (slayt) sayısı sabit değildir. Girilen metnin uzunluğuna göre, tüm metin yerleştirilene kadar dinamik olarak artar.
6.  **Esnek Satır Limiti (12-14 satır):** Her bir görsel (slayt) genellikle 12 satırı geçmemelidir. Ancak, bir cümlenin anlamsız bir yerde bölünmesini önlemek amacıyla, eğer cümlenin geri kalan kısmı (örneğin 1-2 kelime) sığıyorsa mevcut slayt cümleyi bir arada tutmak için en fazla 14 satıra kadar uzatılabilir. Bu, kod tarafından uygulanan katı bir kuraldır.
7.  **Taşma Engeli:** Hem başlık hem de gövde metni, her zaman kanvasın ortasındaki metin kutusu alanının **içinde kalmalıdır**. Metin, bu alanın dışına dikey veya yatay olarak **asla taşmamalıdır**. Uzun başlıklar otomatik olarak alt satırlara sarılmalıdır.
8.  **Otomatik Başlık Mantığı:** Kullanıcı bir başlık belirtmemişse, girilen metnin ilk cümlesi otomatik olarak başlık olarak kullanılır. Bu durumda, başlık olarak kullanılan bu cümle ana metnin başından **kesinlikle çıkarılmalıdır**.
9.  **Paragraf, Satır Başı ve Harf Büyüklüğü Koruma:** Kullanıcının metin alanına girdiği paragraflar, satır başları ve harf büyüklüğü (büyük/küçük harf) korunmalı ve oluşturulan tasarımlara aynen yansıtılmalıdır.
10. **Birleşik Yerleşim ve Karusel Davranışı:** Tüm ekran boyutlarında, kontrol paneli ve tasarım önizleme alanı alt alta görüntülenmelidir. Karusel navigasyonu (kaydırma okları) sadece tasarım önizlemelerini etkilemeli, altındaki kontrol paneli ise sabit kalmalıdır.
11. **Başlangıç Görünümü:** Ana içerik giriş alanı ekranın dikeyinde ortalanmalıdır. "Designs" bölümü varsayılan olarak gizli olmalı ve yalnızca içerik oluşturulduktan sonra görünmelidir.
12. **Dikey Boyutlandırma:** Header `10vh` yüksekliğe, ana içerik alanı ise `90vh` yüksekliğe sahip olmalıdır.
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







