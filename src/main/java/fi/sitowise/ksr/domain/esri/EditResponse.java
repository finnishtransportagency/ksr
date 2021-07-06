package fi.sitowise.ksr.domain.esri;

import com.fasterxml.jackson.databind.ObjectMapper;
import fi.sitowise.ksr.exceptions.KsrApiException;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * A POJO representing a response for applyEdits action on FeatureService REST API.
 */
public class EditResponse {
    private List<Result> addResults;
    private List<Result> updateResults;
    private List<Result> deleteResults;
    private Map<String, Object> error;

    /**
     * Returns list of results for add-operations.
     *
     * @return List of results for add-operations.
     */
    public List<Result> getAddResults() {  return addResults; }

    /**
     * Set list of results for add-operations.
     *
     * @param addResults List of results for add-operations.
     */
    public void setAddResults(List<Result> addResults) { this.addResults = addResults; }

    /**
     * Returns list of results for update-operations.
     *
     * @return List of results for update-operations.
     */
    public List<Result> getUpdateResults() { return updateResults; }

    /**
     * Set list of results for update-operations.
     *
     * @param updateResults List of results for update-operations.
     */
    public void setUpdateResults(List<Result> updateResults) { this.updateResults = updateResults; }

    /**
     * Get list of results for delete-operations.
     *
     * @return List of results for delete-operations.
     */
    public List<Result> getDeleteResults() { return deleteResults; }

    /**
     * Set list of results for delete-operations.
     *
     * @param deleteResults List of results for delete-operations.
     */
    public void setDeleteResults(List<Result> deleteResults) { this.deleteResults = deleteResults; }

    public Map<String, Object> getError() {
        return error;
    }

    public void setError(Map<String, Object> error) {
        this.error = error;
    }

    /**
     * Returns boolean indicating if any of the add-operations was successful.
     *
     * @return Boolean indicating if any of the add-operations was successful.
     */
    public boolean hasAddSuccess() {
        return addResults != null && addResults.stream().anyMatch(Result::getSuccess);
    }

    /**
     * Return boolean indicating if any of the update-operations was successful.
     *
     * @return Boolean indicating if any of the update-operations was successful.
     */
    public boolean hasUpdateSuccess() {
        return updateResults != null &&  updateResults.stream().anyMatch(Result::getSuccess);
    }

    /**
     * Return boolean indicating if any of the delete-operations was succesful.
     *
     * @return Boolean indicating if any of the delete-operations was succesful.
     */
    public boolean hasDeleteSucess() {
        return deleteResults != null && deleteResults.stream().anyMatch(Result::getSuccess);
    }

    /**
     * Constructs an EditResponse from InputStream, or throws an exception if something fails.
     *
     * @param is InputStream to parse EditResponse from.
     * @return EditResponse.
     */
    public static EditResponse fromInputStream(InputStream is) {
        ObjectMapper om = new ObjectMapper();
        try {
            return om.readValue(is, EditResponse.class);
        } catch (IOException e) {
            throw new KsrApiException.InternalServerErrorException("Error deserializing response from FeatureService", e);
        }
    }
}
