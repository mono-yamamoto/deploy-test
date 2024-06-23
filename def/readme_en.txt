Konica Minolta websites are using SSI in some parts. To utilize Sample data, it is recommended to use SSI.
In development, please preview on the test server or virtual server.

----------------------------------
■Sample data List
----------------------------------
/aa-bb/:		Sample data in Japanese
/aa-en/:		Sample data in English
/shared/:		Shared files (CSS, JS and so on)
readme.txt:	Read me text in Japanese
readme_en.txt:	Read me text in English

The following files are for favicon and webclip.
/favicon.ico
/browserconfig.xml
/apple-touch-icon-precomposed-152x152.png
/apple-touch-icon-precomposed-120x120.png
/apple-touch-icon-precomposed.png
/img/tile/***.png

----------------------------------
■About Sample data
----------------------------------
-Sample data files are located under ”/aa-bb/sample-sitename”.
 Change the file names to appropriate names for your site development.
 Edit and place include files under "/aa-bb/sample-sitename/include" for each site.

-Files placed under "/shared" are the shared files used by entire Konica Minolta websites, and it is included for verification purpose.
 Do not change contents of these files.
 At the delivery, do not include these files.

-In Sample data, there are 2 types of header: mainly used for corporate sites (with the global navigation), and mainly used for business sites (without the global navigation).
Select the type that suits your site.

In the Sample data, all pages are using the header type with the global navigation, except the products sample page (/aa-bb/sample-sitename/product.html).
If using the header type without the global navigation, change <!--#include virtual="/aa-bb/include/header_corporate.inc" --> to <!--#include virtual="/aa-bb/include/header-business.inc" -->.

-In Sample data, there are 2 types of footer.
  -with social media account button and inquiry button
  -without social media account button and inquiry button
Select as appropriate and customize as needed.

In the Sample data, all pages are using the footer type with social media account button and inquiry button, except the products sample page (/aa-bb/sample-sitename/product.html).
If using the footer type without social media account button and inquiry button, change <!--#include virtual="/aa-bb/include/footer-industrieslink.inc" --> to <!--#include virtual="/aa-bb/include/footer-industrieslink-business.inc" -->.


-For each [country-language] directory, there are parts commonly used in the header and footer.
In Sample data, these parts are set as dummy, like "/aa-bb/".
Make appropriate changes depending on the location of each site, as shown in the examples below.

  -from <!--#include virtual="/aa-bb/include/header_corporate.inc（header-business.inc）" -->
   to <!--#include virtual="/[country-language]/include/header_corporate.inc（header-business.inc）" -->

  -from <!--#include virtual="/aa-bb/include/footer-industrieslink.inc（footer-industrieslink-business.inc）" -->
   to <!--#include virtual="/[country-language]/include/footer-industrieslink.inc（footer-industrieslink-business.inc）" -->




