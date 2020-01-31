# Sovelluksen k�ytt�liittym�n testaaminen

Testaus Chromella, Firefoxilla, Edgell� (ja Safarilla)

1. Vaihda kieli
- Vaihda kieli suomesta englanniksi. Valitse Surge, Temperature ja Water Quality ja katso ett� kaikki toimivat.
- Silm�ile sivu l�pi.
- Vaihda kieli takaisin suomeksi.

2. Pienenn� ruudun leveys p��sis�ll�n levyiseksi ja tarkista ettei mik��n hajoa

3. Vie hiiren kursori kausivalinnan yhteydess� olevien kysymysmerkin ja rastin p��lle. Katso ett� infotekstit
ilmestyv�t n�kyviin eiv�tk� mene sis�ll�n ulkopuolelle.

4. Testaa linkkien toimivuus
- Seuraavien kuvakkeiden pit�isi olla linkkej� ja vied� johonkin j�rkev��n osoitteeseen:
	- SYKE
	- Ilmatieteen laitos
	- It�meri.fi
	- alapalkin kaikki logot
	- Anna palautetta linkki: mailto:avoindata.syke@ymparisto.fi?subject=Palautetta%20It�meren%20tila-aineistojen%20latauksesta

5. Testaa virheilmoitukset
- Poista suureiden valinnat
- Klikkaa Hae paikat
- Ruudun yl�osaan tulee seuraavat virheilmoitukset (virheelliset kohdat on merkattu my�s erikseen):
	- Valitse v�hint��n yksi haettava suure
	- Aikav�lin alkup�iv� puuttuu
- Valitse Aallokko, Pintaveden l�mp�tila ja Vedenlaatu mutta �l� rasti niist� valintoja
- Valitse aikav�lin alkup�iv�ksi my�hempi p�iv� kuin aikav�lin loppup�iv�ksi ja valitse kauden alkup�iv�ksi
mik� tahansa p�iv�
- Klikkaa Hae data
- Virheilmoitukset ovat nyt seuraavat:
	- Valitse v�hint��n yksi paikka.
	- Valitse v�hint��n yksi haettava suure.
	- Aikav�lin alkup�iv� ei voi olla aikav�lin loppup�iv�n j�lkeen.
	- Kauden loppup�iv� puuttuu.
- Tyhjenn� kausivalinta klikkaamalla rastikuvaketta

6. Testaa L�mp�tilan haku
- Valitse Pintaveden l�mp�tila
- Testaa, ett� Valitse kaikki -valinta toimii, lopuksi valitse kaikki
- Valitse aikav�liksi edellisen kes�kuun kaikki p�iv�t
- Hae paikat, katso ett� info-teksti tulee n�kyviin
- Valitse alasvetovalikosta kaksi paikkaa, katso ett� ne n�kyv�t kartalla sinisell�
- Poista toinen paikkavalinta ja katso ett� kartalla k�y samoin
- Pid� shift pohjassa ja valitse kartalta toinen paikka. Katso ett� se tulee my�s paikkalistaan.
- Poista paikat klikkaamalla karttaa
- Pid� ctrl pohjassa ja valitse kartalta useampi paikka laatikkovalinnalla
- Poista paikat
- Valitse paikat Suomenlahti aaltopoiju, Porvoo Em�salo Vaarlahti ja Espoonlahti 1
- Hae data, katso ett� infoteksti ilmestyy painikkeen alle kun data on haettu
- Lataa csv-tiedosto
- Avaa tiedosto ja tarkista, ett� eri asemien data on muotoiltu samalla tavalla ja jokaiselta asemalta on dataa 

7. Testaa N�k�syvyys, J��npaksuus ja Vedenlaatu
- Poista Pintaveden l�mp�tilan valinta (�l� poista rasteja kuitenkaan)
- Valitse N�k�syvyys, J��npaksuus ja Vedenlaatu
- Testaa, ett� Vedenlaadun Valitse kaikki -valinta toimii, lopuksi valitse Happi, liukoinen ja pH
- Valitse kaikki syvyydet
- Valitse aikav�liksi 2008/02/29 - 2019/12/31 ja kaudeksi 06/01 - 06/30
- Hae paikat
- Valitse F2 ja SR8
- Hae data
- Tarkista ett� tulokseksi tulee J��npaksuus - Ei rivej�, N�k�syvyys - kummaltakin asemalta yksi rivi ja
Vedenlaatu-tiedostossa on tuloksia kummalleki asemalle ja kummallekin muuttujalle. Katso ett� SR8:n koordinaatit
n�kyv�t viiden desimaalin tarkkuudella. Tarkista ett� pH-mittauksia on F2-asemalta syvyyksille 1-89 m (12 syvyytt�). 
- Poista N�k�syvyyden ja J��npaksuuden valinnat
- Valitse Vedenlaadun lis�ksi Pintaveden l�mp�tila -> Havaintoasemat (SYKE)
- Valitse Vedenlaatuun lis�ksi L�mp�tila
- Valitse syvyysv�li 50,5-100 m
- Hae data
- Tarkista ett� Pintaveden l�mp�tila -datassa syvyydet ovat 1-10 m ja ett� Vedenlaatu-datassa on
pH-, l�mp�tila- ja happi-mittauksia, joiden pienin syvyys on 60 m

8. Testaa Vedenkorkeus ja Aallokko
- Poista valitut suureet
- Valitse Vedenkorkeus ja Aallokko
- Testaa ett� Aallokon Valitse kaikki toimii, valitse lopuksi kaikki
- Valitse aikav�liksi 2018/01/01 - 2020/01/01 ja kaudeksi 12/01 - 01/01
- Hae paikat
- Valitse Porvoo Em�salo Vaarlahti ja Suomenlahti aaltopoiju
- Hae data
- Tarkista ett� Aallokko-tiedostossa on tuloksia kaikista viidest� muuttujasta ja halutuilta p�ivilt�
vuosilta 2018, 2019 ja 2020
- Katso ett� vedenkorkeudesta on my�s tullut dataa
- Poista Aallokko-valinta
- Hae paikat -> varmista ett� edelliset paikkavalinnat poistuivat
- Tarkista ett� Suomenlahti aaltopoiju puuttuu paikkalistalta







