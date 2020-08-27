# Lista TODO

Mini projekt wykonany w celach rekrutacji.

## Użyte komponenty
Recoil - State management 

Rebass - komponenty ui, theming 

NextJS - SSR

ReactMoment - formatowanie dat

fetch API - zapytania

gorest - gotowe API do zarządzania zadaniami


## UWAGI
-_fetch() - to nakładka do standardowego fetchAPI, która rozróżnia typy zapytań i przesyła token w nagłówku. Nie wczytywałem się specjalnie w politykę zabezpieczeń gorestapi, dlatego nie jestem pewny, czy mój własny klucz, który umieściłem na sztywno w pliku * */components/_fetch.js* * będzie działał poprawnie cały czas

-Lokalnie zapisuję id użytkownika (localstorage). Oprócz api todos użyłem api users, żeby ograniczyć liczbę zapytań.
W przeciwnym wypadku nie było widać efektów usuwania, czy dodawania, gdyż taski ginęły w zalewie danych. Jako, że użytkownicy resetują się sami po jakimś czasie, byłem zmuszony zabezpieczyć się rejestracją konta, do którego będą przypisane taski.

-Komentarze są w języku angielskim (prawdopodobnie nie idealne :P ).

-Jako, że pierwszy raz używałem Rebassa, to nie mam pewności co do poprawności jego użycia. Pobrałem domyślny theme, a następnie go rozszerzyłem w pliku * */pages/_app.js* * 

-W celu zapewnienia sobie globalnego dostępu do stanu wydzieliłem większość atom'ów i selector'ów do odrębnego 
pliku * */components/StateManagement.js* *. Nie widziałem tego typu akcji w żadnej dokumentacji, jednakże rozwiązanie działa bez zarzutów. Dotychczas korzystałem z Redux, bądź Redux/toolkit, więc Recoil jest dla mnie nowością.


