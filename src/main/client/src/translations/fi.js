const fi = {
    mapLayers: {
        title: 'Aineistot',
        active: 'Aktiiviset',
        all: 'Kaikki',
        shape: 'Avaa shape',
        addNewLayer: 'Uusi taso',
        failedToLoadLayer: 'Tason lataus epäonnistui',
        loadingLayers: 'Ladataan karttatasoja',
    },
    search: {
        title: 'Haku',
        suggestions: 'Hakuehdotukset',
        buttonSearch: 'Hae',
        chooseLayer: 'Valitse taso',
        searchAllFields: 'Hae kaikista kentistä',
        addField: 'Lisää hakukenttä',
        searchLayerGroupName: 'Hakutulokset',
        allQueryableLayers: 'Kaikki tasot',
        allActiveLayers: 'Kaikki aktiiviset tasot',
        layer: 'Taso',
        property: 'Kiinteistö',
    },
    reactTable: {
        previousText: 'Edellinen',
        nextText: 'Seuraava',
        loadingText: 'Ladataan...',
        noDataText: 'Rivejä ei löytynyt',
        pageText: 'Sivu',
        ofText: '/',
        rowsText: 'riviä',
        filter: 'Suodata sarakkeita',
        clearTableData: 'Valintojen ja hakujen tyhjennys',
        deleteSelected: 'Poista kohteita',
        saveEditedData: 'Tallenna muutokset',
        bufferSelectedData: 'Puskurialue valituille kohteille',
    },
    esriMap: {
        openGoogleStreetView: 'Google Street View',
        selectIntersectFeatures: 'Aluevalinta',
        setBuffer: 'Puskurialue',
        noFeatures: 'Ei kohteita',
        getPropertyInfo: 'Kiinteistötiedot',
        caseManagementLink: 'Asianhallinta',
        alfrescoLink: 'Alfresco',
    },
    modalFilter: {
        title: 'Suodata sarakkeita',
        submit: 'Suodata',
        cancel: 'Peruuta',
    },
    modalClearTable: {
        submit: 'Tyhjennä',
        cancel: 'Peruuta',
        content: 'Haluatko tyhjentää taulukon kaikki kentät ja haetut tasot karttatasovalikosta?',
    },
    modalDeleteSelected: {
        title: 'Kohteiden poistaminen',
        submit: 'Poista',
        cancel: 'Peruuta',
        content: 'Poista valitut kohteet?',
        commentLabel: 'Syy kohteiden poistamiseen (ei pakollinen)',
        deleteAmount: 'Poistettavien kohteiden määrä',
    },
    modalSaveEditedData: {
        title: 'Tallenna muutokset',
        submit: 'Tallenna',
        cancel: 'Peruuta',
        content: 'Haluatko tallentaa taulukkoon tekemät muutokset?',
    },
    modalBufferSelectedData: {
        title: 'Määritä valittujen kohteiden puskurialue',
        singleTitle: 'Määritä valitun kohteen puskurialue',
        submit: 'Laske',
        cancel: 'Peruuta',
        bufferLabel: 'Anna puskurialueen koko metreinä',
    },
    modalLayerDetails: {
        title: 'Luo uusi kohde',
        submit: 'Tallenna',
        cancel: 'Peruuta',
    },
    modalAddUserLayer: {
        title: 'Lisää uusi taso',
        submit: 'Lisää',
        cancel: 'Peruuta',
        name: 'Nimi',
        type: 'Tyyppi',
        url: 'URL-osoite',
        layers: 'Tasot',
        opacity: 'Läpinäkyvyys',
        minScale: 'Minimi mittakaava',
        maxScale: 'Maksimi mittakaava',
        transparent: 'Läpinäkyvä',
        attribution: 'Attribuutio',
        desktopVisible: 'Työpöytänäkyvyys',
        mobileVisible: 'Mobiilinäkyvyys',
        styles: 'Tyylit',
        infoTooltip: {
            name: 'Tason näkyvä nimi',
            type: 'Tason kohteiden tyyppi',
            url: 'Karttapalvelun osoite',
            layers: 'Karttapalvelun sisältämien tasojen nimet, erotellaan pilkulla mikäli monta tasoa',
            opacity: 'Tason läpinäkyvyys kartalla',
            minScale: 'Minimi mittakaava jolloin taso on näkyvillä kartalla',
            maxScale: 'Maksimi mittakaava jolloin taso on näkyvillä kartalla',
            attribution: 'Tason tekijänoikeus nimi',
            styles: 'Tason tyylit',
        },
    },
    modalShapefile: {
        title: 'Avaa shape tiedosto',
    },
    dropzoneShape: {
        browse: 'Selaa',
        orText: 'tai',
        dropText: 'Pudota .shp ja .dbf tiedostot tähän',
    },
    sideNav: {
        search: 'Haku',
        layerManagement: 'Aineistot',
        fileExport: 'Tiedostojen vienti',
        workspace: 'Työtilat',
    },
    table: {
        noTableText: 'Ei näytettävää dataa.',
    },
    sketchTool: {
        selectTool: 'Valintatyökalut',
        drawRectangle: 'Suorakulmiovalinta',
        drawPolygonSelect: 'Lassovalinta',
        drawCircle: 'Ympyrävalinta',
        removeSelection: 'Poista valinnat',
        rejectSelection: 'Hylkää kohde',
        acceptSelection: 'Hyväksy kohde',
        activeAdmin: 'Luontityökalu',
    },
    mapMeasure: {
        drawLine: 'Mittaa etäisyys',
        drawPolygon: 'Mittaa pinta-ala',
        selectTool: 'Mittaustyökalut',
        removeDraw: 'Poista mittaukset',
    },
    mapLayerView: {
        removeTooltip: 'Poista karttataso',
    },
    modalRemoveUserLayer: {
        content: 'Haluatko varmasti poistaa karttatason? Karttatason poistaminen poistaa karttatason tietokannasta. Jos haluat vain piilottaa karttatason, paina "PERUUTA".',
        submit: 'Poista',
        cancel: 'Peruuta',
    },
    workspace: {
        title: 'Työtilat',
        newWorkspace: 'Luo uusi työtila',
        replaceWorkspace: 'Korvaa työtila',
        deleteWorkspace: 'Poista työtila',
        workspaceLoaded: 'Ladattu työtila',
        loadingWorkspace: 'Ladataan työtilaa',
        confirmDelete: {
            body: 'Haluatko varmasti poistaa valitun työtilan?',
            acceptText: 'Poista',
            cancelText: 'Peruuta',
        },
        confirmReplace: {
            body: 'Haluatko varmasti korvata valitun työtilan?',
            acceptText: 'Korvaa',
            cancelText: 'Peruuta',
        },
        confirmSelect: {
            body: 'Haluatko avata valitun työtilan?',
            acceptText: 'Avaa',
            cancelText: 'Peruuta',
        },
    },
    modalNewWorkspace: {
        title: 'Luo uusi työtila',
        workspaceName: 'Työtilan nimi',
        submit: 'Tallenna',
        cancel: 'Peruuta',
        workspaceNameExists: 'Kyseisellä nimellä löytyy jo tallennettu työtila. Syötä uusi nimi tai korvaa olemassa oleva tila tallennettujen työtilojen listasta.',
    },
    mapDraw: {
        drawLine: 'Piirrä viiva',
        drawPolygon: 'Piirrä alue',
        drawPoint: 'Piirrä piste',
        drawText: 'Lisää tekstiä',
        drawErase: 'Poista yksittäinen piirros',
        selectTool: 'Piirtotyökalut',
        removeDraw: 'Poista piirrokset',
    },
    modalDrawText: {
        title: 'Lisää tekstiä kartalle',
        inputLabel: 'Aseta teksti',
        inputPlaceholder: 'Kartan teksti',
        submitText: 'Ok',
        cancelText: 'Peruuta',
    },
    modalFeatureContracts: {
        featureContracts: 'Kohteen sopimukset',
        titleLinkContract: 'Sopimuksen linkittäminen',
        titleNewContract: 'Luo uusi sopimus kohteelle',
        titleEditContract: 'Muokkaa sopimusta',
        titleContractDetails: 'Sopimuksen tiedot',
        submitLinkToContract: 'Linkitä sopimukseen',
        submitNewContract: 'Uusi sopimus',
        submitLinkContract: 'Linkitä sopimus',
        submitSave: 'Tallenna',
        cancelText: 'Peruuta',
        backText: 'Takaisin',
        listView: {
            title: 'Sopimukset kohteelle',
            noContracts: 'Kohteella ei ole vielä sopimuksia, voit luoda uuden sopimuksen kohteelle tai linkittää olemassa olevan sopimuksen kohteelle.',
            details: 'Sopimuksen lisätiedot',
            edit: 'Muokkaa sopimusta',
            unlink: 'Poista sopimuksen linkitys kohteelta',
        },
    },
    saveFeatureData: {
        newFeatureSaveSuccess: 'Kohteen luonti onnistui.',
        newFeatureSaveError: 'Kohteen luonti epäonnistui.',
        layerUpdateSaveSuccess: 'Muokkausten tallennus onnistui.',
        layerUpdateSaveError: 'Muokkausten tallennus epäonnistui.',
        layerUpdateSaveNoFeaturesError: 'Muokkausten kohde tai kohteet on jo poistettu. Päivitä näkymä ja yritä uudelleen.',
        errorLayerNotFound: 'Tallennus epäonnistui. Tasoa ei löydy.',
        featureDeleteSuccess: 'Poistettu kohteet',
        featureDeleteError: 'Kohteiden poisto epäonnistui.',
        featureDeleteNoFeaturesError: 'Kohde tai kohteet on jo poistettu. Päivitä näkymä ja yritä uudelleen.',
    },
    mapLayerSettings: {
        addNewFeature: 'Luo uusi kohde',
        toggleAdminTool: 'Muokkaus päälle/pois',
        toggleVisibility: 'Näytä/piilota karttataso',
    },
    searchProperty: {
        propertyInfo: 'Kiinteistön tiedot',
        propertyIdentifier: 'Kiinteistötunnus',
        parcelCount: 'Palstojen lukumäärä',
        registerUnitType: 'Rekisteriyksikkölaji',
        municipality: 'Kunta',
        name: 'Nimi',
        landArea: 'Maapinta-ala',
        registrationDate: 'Rekisteröintipäivämäärä',
        propertyPrintFiles: {
            title: 'Kiinteistön tulosteet',
            registerunit: 'Kiinteistörekisteriote',
            deed: 'Lainhuutotodistus',
            easement: 'Rasitustodistus',
            maps: 'Kiinteistörekisterin karttaotteet',
            map: 'Kiinteistörekisterin karttaote',
        },
        errorToast: {
            searchFailed: 'Kiinteistöhaku epäonnistui. Yritä uudelleen.',
            searchLinksFailed: 'Kiinteistötulosteiden haku epäonnistui.',
            searchCoordsNoResults: 'Koordinaateilla ei löytynyt yhtään kiinteistöä.',
            searchIdNoResults: 'Kiinteistötunnuksella ei löytynyt yhtään kiinteistöä.',
        },
    },
};

export default fi;
