package fi.sitowise.ksr.utils.ktj;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class KTJConstantsTests {

    @Test
    public void testGetRegisterUnit() {
        Assert.assertEquals("(Tuntematon)", KTJConstants.getRegisterUnitTypeName("0"));
        Assert.assertEquals("Tila", KTJConstants.getRegisterUnitTypeName("1"));
        Assert.assertEquals("Valtion metsämaa", KTJConstants.getRegisterUnitTypeName("3"));
        Assert.assertEquals("Lunastusyksikkö", KTJConstants.getRegisterUnitTypeName("4"));
        Assert.assertEquals("Kruununkalastus", KTJConstants.getRegisterUnitTypeName("5"));
        Assert.assertEquals("Yleiseen tarpeeseen erotettu alue", KTJConstants.getRegisterUnitTypeName("6"));
        Assert.assertEquals("Erillinen vesijättö", KTJConstants.getRegisterUnitTypeName("7"));
        Assert.assertEquals("Yleinen vesialue", KTJConstants.getRegisterUnitTypeName("8"));
        Assert.assertEquals("Yhteinen alue", KTJConstants.getRegisterUnitTypeName("9"));
        Assert.assertEquals("Yhteismetsä", KTJConstants.getRegisterUnitTypeName("10"));
        Assert.assertEquals("Tie- tai liitännäisalue", KTJConstants.getRegisterUnitTypeName("11"));
        Assert.assertEquals("Lakkautettu tie- tai liitännäisalue", KTJConstants.getRegisterUnitTypeName("12"));
        Assert.assertEquals("Tontti", KTJConstants.getRegisterUnitTypeName("13"));
        Assert.assertEquals("Yleinen alue", KTJConstants.getRegisterUnitTypeName("14"));
        Assert.assertEquals("Selvittämätön yhteinen alue", KTJConstants.getRegisterUnitTypeName("15"));
        Assert.assertEquals("Yhteinen vesialue", KTJConstants.getRegisterUnitTypeName("17"));
        Assert.assertEquals("Yhteinen maa-alue", KTJConstants.getRegisterUnitTypeName("18"));
        Assert.assertEquals("Suojelualuekiinteistö", KTJConstants.getRegisterUnitTypeName("19"));
        Assert.assertEquals("Tie- tai liitännäisalue tieoikeudella", KTJConstants.getRegisterUnitTypeName("21"));
        Assert.assertEquals("Tie- tai liitännäisalue omistusoikeudella", KTJConstants.getRegisterUnitTypeName("22"));
        Assert.assertEquals("Yleisen alueen lisäosa", KTJConstants.getRegisterUnitTypeName("23"));
        Assert.assertEquals("Tuntematon kunnan rekisteriyksikkö", KTJConstants.getRegisterUnitTypeName("24"));
        Assert.assertEquals("Yhteinen erityinen etuus", KTJConstants.getRegisterUnitTypeName("25"));
        Assert.assertEquals("Selvittämätön alue", KTJConstants.getRegisterUnitTypeName("99"));
        Assert.assertNull(KTJConstants.getRegisterUnitTypeName(null));
        Assert.assertNull(KTJConstants.getRegisterUnitTypeName(""));
    }
}
