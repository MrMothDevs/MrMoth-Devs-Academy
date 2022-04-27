
# Info per faqen

MrMothDevs Academy a.k.a MDA eshte nje E-Learning Web App i cili ofron kurse te ndryshme rreth degeve te teknologjise si ndertim website, ndertim aplikacioni, databaze, strukture te dhenash etj.

## Si te bejme setup

Do te perdorim [npm](https://www.npmjs.com/) te instalojm te gjitha dependecit.

```bash
npm install
```

Me pas hapim nje file .env ne direktorine kryesore dhe vendosim:
(Nese ju kemi derguar .env ne email atehere vendosni ate file!)
```bash
MONGO_URI=
nodemailer_api_key=
nodemailer_domain=
emailReceiver=
session_secret=
token_secret=
USER=
SECRET=
```
## Frontend

Kristjan Seraj 
- Twitter - [@coku_mr](https://twitter.com/coku_mr)
- Gmail - serajkristi@gmail.com

Per pjesen FrontEnd anetari i grupit [MrMothDevs](https://github.com/MrMothDevs), Kristjan Seraj ka perdorur HTML, CSS, JS, JQuery, Bootstrap.

Ne fillim u krijuan faqet e jashtme te HTML per home, kurset, login, signup, profile duke mbajtur te te gjitha keto faqet te njejtin dizanj ne CSS. Footer dhe Nav i perbashket gjithashtu <meta> tags per te permiresuar SEO e website.

CSS ka rregulluar stilimet per cdo text, imazh, kuti, buton apo div, gjithashtu me ane te nje tool cdo property e CSS punon te te gjithe browserat (dhe ata te vjeter qe nuk i suportojne property e reja te CSS).

Me ane te @media query websiti eshte responsive per cdo lloj device.

JS dhe JQuery eshte perdorur per funksione te vogla si popup, buton per scroll, per navbar responsive, per ndryshimin e ngjyres se navbarit ne scroll, per nje pre loader(nderkohe qe pret website te hapet shfaqet nje spinner qe leviz) dhe eshte perdorur JS per funksion te passwordit qe mund ta shfaqim nderkohe qe e vendosim.

Me ane te JS dhe CSS eshte bere e mundur nje buton switcher i cili ndryshon nga light mode (ku ngjyrat jane te ndezura) ne dark mode(ku ngjyrat jane me te lehta).

Bootstrap eshte perdorur per funksionin e nje carousel dhe ndertimin e tij.


## Backend
- Twitter - [@ergin](https://twitter.com/ergindapaj)
- Gmail - ergindapaj081@gmail.com

Per pjesen Backend anetari i grupit [MrMothDevs](https://github.com/MrMothDevs), Ergin Dapaj ka perdorur Node js, express, ejs, mongodb, mongoose etj.

Per template engine eshte perdorur ejs, eshte e thjeshte ne perdorim dhe efektive.
Rregjistrimet e llogarive behen nepermjet databases Mongodb dhe Mongoose per menaxhimin e te dhenave, dhe passworded behen hash.

Pas rregjistrimit kryhet verifikimi i llogarise nepermjet emailit, ne kete rast kemi perdorur [SendinBlue](https://www.sendinblue.com/) si serverin SMTP.
Verifikimi kryhet nepermjet nje kodi unik qe krijohet ne te njejten kohe me llogarine!

Me pas vjen [Courses](https://mrmothdevs.herokuapp.com/courses), kurset jan te vendosura manualisht ne databaze dhe me pas shfaqen ne web.
Ju mund te blini nje kurs, nese nuk jeni loguar do te beheni redirect te login dhe me pas e blini.
Pasi ju blini nje kurs ai automatikisht do shtohet ne te dhenat e llogarise tende.

[ContactUs](https://mrmothdevs.herokuapp.com/contact), Gjithashtu perdor si server SMTP [SendinBlue](https://www.sendinblue.com/).
Te gjitha te dhenat do te dergohen te emaili qe eshte deklaruar ne direktorin .env!

[Profile](https://mrmothdevs.herokuapp.com/profile), Profili na lejon te editojm Username, Password dhe gjithashtu te shikojm kurset e blera.
Nese llogaria jot ka Admin, ju mund te aksesoni [Members](https://mrmothdevs.herokuapp.com/members). (Roli admin mund te jepet vetem manualisht nga databaza.)


