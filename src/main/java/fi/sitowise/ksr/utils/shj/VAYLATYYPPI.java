package fi.sitowise.ksr.utils.shj;

public enum VAYLATYYPPI {
    RATA("RATA", "rautatie"),
    TIE("TIE", "tie"),
    VESI("VESI", "vesiväylä"),
    MUU("MUU", "muu");
    private String ksrName;
    private String shjName;

    VAYLATYYPPI(String ksrName, String shjName) {
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
