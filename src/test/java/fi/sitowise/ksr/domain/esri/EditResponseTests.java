package fi.sitowise.ksr.domain.esri;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class EditResponseTests {

    @Test
    public void testHasAddSuccessShouldHave() {
        EditResponse er = new EditResponse();
        er.setAddResults(createResults(true));
        Assert.assertTrue(er.hasAddSuccess());
    }

    @Test
    public void testHasAddSuccessShouldNotHave() {
        EditResponse er = new EditResponse();
        er.setAddResults(createResults(false));
        Assert.assertFalse(er.hasAddSuccess());
    }

    @Test
    public void testHasEditSuccessShouldHave() {
        EditResponse er = new EditResponse();
        er.setUpdateResults(createResults(true));
        Assert.assertTrue(er.hasUpdateSuccess());
    }

    @Test
    public void testHasEditSuccessShouldNotHave() {
        EditResponse er = new EditResponse();
        er.setUpdateResults(createResults(false));
        Assert.assertFalse(er.hasUpdateSuccess());
    }

    @Test
    public void testHasDeleteSuccessShouldHave() {
        EditResponse er = new EditResponse();
        er.setDeleteResults(createResults(true));
        Assert.assertTrue(er.hasDeleteSucess());
    }

    @Test
    public void testHasDeleteSuccessShouldNotHave() {
        EditResponse er = new EditResponse();
        er.setDeleteResults(createResults(false));
        Assert.assertFalse(er.hasDeleteSucess());
    }

    private List<Result> createResults(boolean shouldHaveOneSuccess) {
        List<Result> results = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            boolean success = false;
            if (i % 5 == 0) {
                success = shouldHaveOneSuccess;
            }
            Result result = new Result();
            result.setSuccess(success);
            result.setObjectId(i);
            results.add(result);
        }
        return results;
    }
}
