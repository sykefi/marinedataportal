# Sovelluksen käyttöliittymän testaaminen

Testaus Chromella, Firefoxilla, Edgellä (ja Safarilla)

1. Vaihda kieli
- Vaihda kieli suomesta englanniksi. Valitse Surge, Temperature ja Water Quality ja katso että kaikki toimivat.
- Silmäile sivu läpi.
- Vaihda kieli takaisin suomeksi.

2. Pienennä ruudun leveys pääsisällön levyiseksi ja tarkista ettei mikään hajoa

3. Vie hiiren kursori kausivalinnan yhteydessä olevien kysymysmerkin ja rastin päälle. Katso että infotekstit
ilmestyvät näkyviin eivätkä mene sisällön ulkopuolelle.

4. Testaa linkkien toimivuus
- Seuraavien kuvakkeiden pitäisi olla linkkejä ja viedä johonkin järkevään osoitteeseen:
	- SYKE
	- Ilmatieteen laitos
	- Itämeri.fi
	- alapalkin kaikki logot
	- Anna palautetta linkki: mailto:avoindata.syke@ymparisto.fi?subject=Palautetta%20Itämeren%20tila-aineistojen%20latauksesta

5. Testaa virheilmoitukset
- Poista suureiden valinnat
- Klikkaa Hae paikat
- Ruudun yläosaan tulee seuraavat virheilmoitukset (virheelliset kohdat on merkattu myös erikseen):
	- Valitse vähintään yksi haettava suure
	- Aikavälin alkupäivä puuttuu
- Valitse Aallokko, Pintaveden lämpötila ja Vedenlaatu mutta älä rasti niistä valintoja
- Valitse aikavälin alkupäiväksi myöhempi päivä kuin aikavälin loppupäiväksi ja valitse kauden alkupäiväksi
mikä tahansa päivä
- Klikkaa Hae data
- Virheilmoitukset ovat nyt seuraavat:
	- Valitse vähintään yksi paikka.
	- Valitse vähintään yksi haettava suure.
	- Aikavälin alkupäivä ei voi olla aikavälin loppupäivän jälkeen.
	- Kauden loppupäivä puuttuu.
- Tyhjennä kausivalinta klikkaamalla rastikuvaketta

6. Testaa Lämpötilan haku
- Valitse Pintaveden lämpötila
- Testaa, että Valitse kaikki -valinta toimii, lopuksi valitse kaikki
- Valitse aikaväliksi edellisen kesäkuun kaikki päivät
- Hae paikat, katso että info-teksti tulee näkyviin
- Valitse alasvetovalikosta kaksi paikkaa, katso että ne näkyvät kartalla sinisellä
- Poista toinen paikkavalinta ja katso että kartalla käy samoin
- Pidä shift pohjassa ja valitse kartalta toinen paikka. Katso että se tulee myös paikkalistaan.
- Poista paikat klikkaamalla karttaa
- Pidä ctrl pohjassa ja valitse kartalta useampi paikka laatikkovalinnalla
- Poista paikat
- Valitse paikat Suomenlahti aaltopoiju, Porvoo Emäsalo Vaarlahti ja Espoonlahti 1
- Hae data, katso että infoteksti ilmestyy painikkeen alle kun data on haettu
- Lataa csv-tiedosto
- Avaa tiedosto ja tarkista, että eri asemien data on muotoiltu samalla tavalla ja jokaiselta asemalta on dataa 

7. Testaa Näkösyvyys, Jäänpaksuus ja Vedenlaatu
- Poista Pintaveden lämpötilan valinta (älä poista rasteja kuitenkaan)
- Valitse Näkösyvyys, Jäänpaksuus ja Vedenlaatu
- Testaa, että Vedenlaadun Valitse kaikki -valinta toimii, lopuksi valitse Happi, liukoinen ja pH
- Valitse kaikki syvyydet
- Valitse aikaväliksi 2008/02/29 - 2019/12/31 ja kaudeksi 06/01 - 06/30
- Hae paikat
- Valitse F2 ja SR8
- Hae data
- Tarkista että tulokseksi tulee Jäänpaksuus - Ei rivejä, Näkösyvyys - kummaltakin asemalta yksi rivi ja
Vedenlaatu-tiedostossa on tuloksia kummalleki asemalle ja kummallekin muuttujalle. Katso että SR8:n koordinaatit
näkyvät viiden desimaalin tarkkuudella. Tarkista että pH-mittauksia on F2-asemalta syvyyksille 1-89 m (12 syvyyttä). 
- Poista Näkösyvyyden ja Jäänpaksuuden valinnat
- Valitse Vedenlaadun lisäksi Pintaveden lämpötila -> Havaintoasemat (SYKE)
- Valitse Vedenlaatuun lisäksi Lämpötila
- Valitse syvyysväli 50,5-100 m
- Hae data
- Tarkista että Pintaveden lämpötila -datassa syvyydet ovat 1-10 m ja että Vedenlaatu-datassa on
pH-, lämpötila- ja happi-mittauksia, joiden pienin syvyys on 60 m

8. Testaa Vedenkorkeus ja Aallokko
- Poista valitut suureet
- Valitse Vedenkorkeus ja Aallokko
- Testaa että Aallokon Valitse kaikki toimii, valitse lopuksi kaikki
- Valitse aikaväliksi 2018/01/01 - 2020/01/01 ja kaudeksi 12/01 - 01/01
- Hae paikat
- Valitse Porvoo Emäsalo Vaarlahti ja Suomenlahti aaltopoiju
- Hae data
- Tarkista että Aallokko-tiedostossa on tuloksia kaikista viidestä muuttujasta ja halutuilta päiviltä
vuosilta 2018, 2019 ja 2020
- Katso että vedenkorkeudesta on myös tullut dataa
- Poista Aallokko-valinta
- Hae paikat -> varmista että edelliset paikkavalinnat poistuivat
- Tarkista että Suomenlahti aaltopoiju puuttuu paikkalistalta







