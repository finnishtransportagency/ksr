package fi.sitowise.ksr.controller;

import fi.sitowise.ksr.exceptions.KsrApiException;
import fi.sitowise.ksr.service.SHJService;
import fi.sitowise.ksr.utils.shj.KayttooikeussopimusFieldNames;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Map;

/**
 * RestController for SHJ (sopimuksenhallintajärjestelmä, contract management system).
 */

@RestController
@RequestMapping(SHJController.SHJ_API_URL)
@PreAuthorize("hasAnyAuthority('KSR_ROLE_SOPULI_USER', 'KSR_ROLE_ADMIN')")
public class SHJController {

    private final SHJService shjService;

    private static final Logger LOG = LogManager.getLogger(ProxyController.class);

    public static final String SHJ_API_URL = "/api/shj";

    public SHJController(SHJService shjService) {
        this.shjService = shjService;
    }

    @ApiOperation("Add new contract (käyttöoikeussopimus).")
    @ApiImplicitParams({
            @ApiImplicitParam(
                    name = "attributes",
                    value = "Object with following allowed properties\n\n" +
                            "sopimusnumero: String" +
                            "sopimustunniste: String, required \n" +
                            "kohde: String,\n" +
                            "kayttotarkoitus: String,\n" +
                            "saantotapa: Integer,\n" +
                            "voimassaoloAlkaa: String, format=YYYY-MM-DD,\n" +
                            "voimassaoloPaattyy: String, format=YYYY-MM-DD,\n" +
                            "paattymistapa: Integer,\n" +
                            "korvaustapa: Integer,\n" +
                            "sopimustapa: Integer,\n" +
                            "liikennemuoto: String\n" +
                            "lisatiedot: String,\n" +
                            "muokkausaika: String, format=YYYY-MM-DD,\n" +
                            "muokkaaja: String,\n" +
                            "diaarinumero: String.",
                    required = true,
                    paramType = "body"),
    })
    @PostMapping(value = "/kos")
    public ResponseEntity<?> addKayttooikeussopimus(@RequestBody Map<String, Object> attributes) throws IOException {
        try {
            if (shjService.addFeature(attributes)) {
                LOG.info(String.format(
                        "Contract with contract identifier %s added by using SHJ API.",
                        attributes.get(KayttooikeussopimusFieldNames.SOPIMUSTUNNISTE.getShjName())
                ));
                return ResponseEntity.ok().build();
            }
            LOG.info(String.format(
                    "Could not add a new contract with contract identifier %s by using SHJ API.",
                    attributes.get(KayttooikeussopimusFieldNames.SOPIMUSTUNNISTE.getShjName())
            ));
            return ResponseEntity.badRequest().build();
        } catch (URISyntaxException e) {
            LOG.error("Could not build url for adding feature by SHJ API.");
            throw new KsrApiException.InternalServerErrorException("Error when trying to create new contract.");
        } catch (KsrApiException.BadRequestException e) {
            LOG.error(String.format("Bad request: %s", e.getMessage()), e.getCause());
            throw new KsrApiException.BadRequestException(String.format("Bad request: %s", e.getMessage()), e);
        } catch (Exception e) {
            LOG.error(String.format("Unexpected error: %s", e.getMessage()), e.getCause());
            throw new KsrApiException.InternalServerErrorException("Unexpected error:", e);
        }
    }

    @ApiOperation("Update existing contract (käyttöoikeussopimus).")
    @ApiImplicitParams({
            @ApiImplicitParam(
                    name = "attributes",
                    value = "Object with following allowed properties\n\n" +
                            "sopimusnumero: String" +
                            "sopimustunniste: String, required \n" +
                            "kohde: String,\n" +
                            "kayttotarkoitus: String,\n" +
                            "saantotapa: Integer,\n" +
                            "voimassaoloAlkaa: String, format=YYYY-MM-DD,\n" +
                            "voimassaoloPaattyy: String, format=YYYY-MM-DD,\n" +
                            "paattymistapa: Integer,\n" +
                            "korvaustapa: Integer,\n" +
                            "sopimustapa: Integer,\n" +
                            "liikennemuoto: String\n" +
                            "lisatiedot: String,\n" +
                            "muokkausaika: String, format=YYYY-MM-DD,\n" +
                            "muokkaaja: String,\n" +
                            "diaarinumero: String.",
                    required = true,
                    paramType = "body"),
    })
    @PutMapping(value = "/kos")
    public ResponseEntity<?> updateKayttooikeussopimus(@RequestBody Map<String, Object> attributes) throws IOException {
        try {
            if (shjService.updateFeature(attributes)) {
                LOG.info(String.format(
                        "Successfully updated contract with contract identifier %s by using SHJ API.",
                        attributes.get(KayttooikeussopimusFieldNames.SOPIMUSTUNNISTE.getShjName())
                ));
                return ResponseEntity.ok().build();
            }
            LOG.info(String.format(
                    "Could not update contract with contract identifier %s by using SHJ API.",
                    attributes.get(KayttooikeussopimusFieldNames.SOPIMUSTUNNISTE.getShjName())
            ));
            return ResponseEntity.badRequest().build();
        } catch (URISyntaxException e) {
            LOG.error("Could not build url for adding feature by SHJ API.");
            throw new KsrApiException.InternalServerErrorException("Error when trying to update contract.");
        } catch (KsrApiException.BadRequestException e) {
            LOG.error(String.format("Bad request: %s", e.getMessage()), e.getCause());
            throw new KsrApiException.BadRequestException(String.format("Bad request: %s", e.getMessage()), e);
        } catch (KsrApiException.NotFoundErrorException e) {
            LOG.error(String.format("Not found: %s", e.getMessage()), e.getCause());
            throw new KsrApiException.NotFoundErrorException(String.format("Not found: %s", e.getMessage()));
        } catch (Exception e) {
            LOG.error(String.format("Unexpected error: %s", e.getMessage()), e.getCause());
            throw new KsrApiException.InternalServerErrorException("Unexpected error:", e);
        }
    }

}
