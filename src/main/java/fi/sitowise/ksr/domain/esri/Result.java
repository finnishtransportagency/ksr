package fi.sitowise.ksr.domain.esri;

/**
 * Represents a Result from FeatureService applyEdits -action.
 */
public class Result {
    private Integer objectId;
    private Boolean success;

    /**
     * Get the objectId.
     *
     * @return The objectId.
     */
    public Integer getObjectId() { return objectId; }

    /**
     * Set the objectId.
     *
     * @param objectId The objectId.
     */
    public void setObjectId(Integer objectId) { this.objectId = objectId; }

    /**
     * Get boolean indicating operation success.
     *
     * @return Boolean indicating opration success.
     */
    public Boolean getSuccess() { return success; }

    /**
     * Set boolean indicating operation success.
     *
     * @param success Boolean indicating operation success.
     */
    public void setSuccess(Boolean success) { this.success = success; }
}
