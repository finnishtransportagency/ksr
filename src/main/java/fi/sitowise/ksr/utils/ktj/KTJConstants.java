package fi.sitowise.ksr.utils.ktj;

/**
 * A class for holding KTJ-specific constants.
 *
 * Constants in this class are considered really to be constants,
 * meaning that it is unexpected that their meaning changes.
 */
class KTJConstants {
    private static final String REGISTER_UNIT_TYPE_0 = "(Tuntematon)";
    private static final String REGISTER_UNIT_TYPE_1 = "Tila";
    private static final String REGISTER_UNIT_TYPE_3 = "Valtion metsämaa";
    private static final String REGISTER_UNIT_TYPE_4 = "Lunastusyksikkö";
    private static final String REGISTER_UNIT_TYPE_5 = "Kruununkalastus";
    private static final String REGISTER_UNIT_TYPE_6 = "Yleiseen tarpeeseen erotettu alue";
    private static final String REGISTER_UNIT_TYPE_7 = "Erillinen vesijättö";
    private static final String REGISTER_UNIT_TYPE_8 = "Yleinen vesialue";
    private static final String REGISTER_UNIT_TYPE_9 = "Yhteinen alue";
    private static final String REGISTER_UNIT_TYPE_10 = "Yhteismetsä";
    private static final String REGISTER_UNIT_TYPE_11 = "Tie- tai liitännäisalue";
    private static final String REGISTER_UNIT_TYPE_12 = "Lakkautettu tie- tai liitännäisalue";
    private static final String REGISTER_UNIT_TYPE_13 = "Tontti";
    private static final String REGISTER_UNIT_TYPE_14 = "Yleinen alue";
    private static final String REGISTER_UNIT_TYPE_15 = "Selvittämätön yhteinen alue";
    private static final String REGISTER_UNIT_TYPE_17 = "Yhteinen vesialue";
    private static final String REGISTER_UNIT_TYPE_18 = "Yhteinen maa-alue";
    private static final String REGISTER_UNIT_TYPE_19 = "Suojelualuekiinteistö";
    private static final String REGISTER_UNIT_TYPE_21 = "Tie- tai liitännäisalue tieoikeudella";
    private static final String REGISTER_UNIT_TYPE_22 = "Tie- tai liitännäisalue omistusoikeudella";
    private static final String REGISTER_UNIT_TYPE_23 = "Yleisen alueen lisäosa";
    private static final String REGISTER_UNIT_TYPE_24 = "Tuntematon kunnan rekisteriyksikkö";
    private static final String REGISTER_UNIT_TYPE_25 = "Yhteinen erityinen etuus";
    private static final String REGISTER_UNIT_TYPE_99 = "Selvittämätön alue";

    /**
     * Get name for registerunittype code ("Rekisteriyksikkölaji").
     *
     * @param registerUnitType Code for registerunittype.
     * @return Name for registerunittype.
     */
    static String getRegisterUnitTypeName(String registerUnitType) {
        if (registerUnitType == null) {
            return null;
        }
        switch (registerUnitType) {
            case "0":
                return REGISTER_UNIT_TYPE_0;
            case "1":
                return REGISTER_UNIT_TYPE_1;
            case "3":
                return REGISTER_UNIT_TYPE_3;
            case "4":
                return REGISTER_UNIT_TYPE_4;
            case "5":
                return REGISTER_UNIT_TYPE_5;
            case "6":
                return REGISTER_UNIT_TYPE_6;
            case "7":
                return REGISTER_UNIT_TYPE_7;
            case "8":
                return REGISTER_UNIT_TYPE_8;
            case "9":
                return REGISTER_UNIT_TYPE_9;
            case "10":
                return REGISTER_UNIT_TYPE_10;
            case "11":
                return REGISTER_UNIT_TYPE_11;
            case "12":
                return REGISTER_UNIT_TYPE_12;
            case "13":
                return REGISTER_UNIT_TYPE_13;
            case "14":
                return REGISTER_UNIT_TYPE_14;
            case "15":
                return REGISTER_UNIT_TYPE_15;
            case "17":
                return REGISTER_UNIT_TYPE_17;
            case "18":
                return REGISTER_UNIT_TYPE_18;
            case "19":
                return REGISTER_UNIT_TYPE_19;
            case "21":
                return REGISTER_UNIT_TYPE_21;
            case "22":
                return REGISTER_UNIT_TYPE_22;
            case "23":
                return REGISTER_UNIT_TYPE_23;
            case "24":
                return REGISTER_UNIT_TYPE_24;
            case "25":
                return REGISTER_UNIT_TYPE_25;
            case "99":
                return REGISTER_UNIT_TYPE_99;
            default:
                return null;
        }
    }
}
