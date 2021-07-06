package fi.sitowise.ksr.utils.shj;

public enum  KayttooikeussopimusFieldNames {
    OBJECTID ("OBJECTID", "OBJECTID"),
    SOPIMUSNUM ("SOPIMUSNUM", "sopimustunniste"),
    SOPNUMTEXT ("SOPNUMTEXT", "sopmuntext"),
    KOHDE ("KOHDE", "kohde"),
    KAYTTOTARK ("KAYTTOTARK", "kayttotarkoitus"),
    SAANTOTAPA ("SAANTOTAPA", "saantotapa"),
    ALKUPAIVA ("ALKUPAIVA", "voimassaoloAlkaa"),
    LOPPUPAIVA ("LOPPUPAIVA", "voimassaoloPaattyy"),
    PAATTYMIST ("PAATTYMIST", "paattymistapa"),
    KORVAUSTAP ("KORVAUSTAP", "korvaustapa"),
    SOPIMUSTAP ("SOPIMUSTAP", "sopimustapa"),
    VIIMEINEN ("VIIMEINEN", "muokkausaika"),
    EDITOIJA ("EDITOIJA", "muokkaaja"),
    DUPLICATE ("DUPLICATE", "DUPLICATE"),
    SHAPE_LENGTH ("SHAPE_LENGTH", "laskettuPituus"),
    LASKETTU_ALA("LASKETTU_ALA", "laskettuPintaala"),
    VAYLATYYPPI ("VAYLATYYPPI", "liikennemuoto"),
    MUISTIINPANOT ("MUISTIINPANOT", "lisatiedot"),
    SAAJA ("SAAJA", "oikeudenSaaja"),
    LUOVUTTAJA ("LUOVUTTAJA", "oikeudenLuovuttaja"),
    KUNTA ("KUNTA", "kunta"),
    ALUE ("ALUE", "alue"),
    DNRO ("DNRO", "diaarinumero");

    private String ksrName;
    private String shjName;

    KayttooikeussopimusFieldNames(String ksrName, String shjName) {
        this.ksrName = ksrName;
        this.shjName = shjName;
    }

    public String getKsrName() {
        return ksrName;
    }

    public String getShjName() {
        return shjName;
    }
}
