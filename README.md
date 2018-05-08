# Kiinteistö- ja sopimusrekisteri

## Kehitysympäristön pystyttäminen
1. Kloonataan ksr-repository koneelle. `git clone https://github.com/finnishtransportagency/ksr.git`
2. Ks. kohta Kääntäminen, kohdat 1 ja 2. Käynnistää sovelluksen paikalliseen porttiin `8080`.
3. Käyttöliittymän kehitys paikallisesti. `cd src/client && npm install && npm start`. Käynnistää käyttöliittymän paikalliseen porttiin `3000`.

## Kääntäminen
1. Luo ympäristökohtainen properties-tiedosto kansioon: `src/main/resources/`. Esimerkiksi, jos tarkoituksena ajaa/kääntää sovellus kehitysympäristöön (dev), niin luodaan `src/main/resources/application-dev.properties` tiedosto. Esimerkkiasetukset voidaan kopioida tiedostosta: `src/main/resources/application.properties.example` vaihtamalla arvot oikeiksi.
2. Sovelluksen ajaminen lokaalisti (kehityksessä): `mvn spring-boot:run -Dspring.profiles.active=dev`.
3. Sovelluksen kääntäminen ja paketoiminen (dev -ympäristöön): `mvn package -Dspring.profiles.active=dev`. Onnistuneen paketoinnin jälkeen `target/` kansiossa on `KSR.war` paketti.