const fi = {
    mapLayers: {
        title: 'Aineistot',
        active: 'Aktiiviset',
        all: 'Kaikki',
        shape: 'Avaa shape',
        addNewLayer: 'Uusi taso',
        failedToLoadLayer: 'Tason lataus epäonnistui',
        toggleLayerLegend: 'Selite',
        toggleIndexMap: 'Indeksikartta',
        filterAllLayers: 'Hae karttatasoja',
        noLayersFound: 'Ei hakua vastaavia karttatasoja',
        userLayerGroupName: 'Käyttäjätasot',
    },
    search: {
        title: 'Haku',
        suggestions: 'Hakuehdotukset',
        buttonSearch: 'Hae',
        buttonClear: 'Tyhjennä',
        chooseLayer: 'Valitse taso',
        searchAllFields: 'Hae kaikista kentistä',
        searchAllFieldsInfo: 'Haku kohdistuu kaikkiin kenttiin. Mikäli tarvetta tarkemmalle haulle, on mahdollista hakea yksittäiseltä aktiiviselta tasolta kerrallaan haluamillaan kentillä.',
        addField: 'Lisää hakukenttä',
        searchLayerGroupName: 'Hakutulokset',
        allQueryableLayers: 'Kaikki tasot',
        allActiveLayers: 'Kaikki aktiiviset tasot',
        layer: 'Taso',
        property: 'Kiinteistö',
        expression: {
            exact: 'Täsmälleen',
            like: 'Sisältää osittain',
            greaterThan: 'Suurempi kuin',
            lessThan: 'Pienempi kuin',
            not: 'Ei sisällä (täsmälleen)',
            notLike: 'Ei sisällä (osittain)',
        },
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
        downloadCsv: 'Lataa CSV',
        deleteSelected: 'Poista kohteita',
        saveEditedData: 'Tallenna muutokset',
        bufferSelectedData: 'Puskurialue valituille kohteille',
        extractSelectedData: 'Tallenna valitut kohteet toiseen paikkatietoformaattiin',
        zoomToSelected: 'Kohdista haluamiin kohteisiin',
        windowPortal: 'Avaa taulu uuteen ikkunaan',
    },
    esriMap: {
        openGoogleStreetView: 'Google Street View',
        selectIntersectFeatures: 'Aluevalinta',
        setBuffer: 'Puskurialue',
        noFeatures: 'Ei kohteita',
        getPropertyInfo: 'Kiinteistötiedot (piste)',
        getStreetInfo: 'Katuosoite',
        getRoadInfo: 'Tieosoite',
        getAllPropertyInfo: 'Kiinteistötiedot (leikkaavat)',
        featureInfoError: 'Ominaisuustietojen haku WMS-tasolle epäonnistui',
        copyFeature: 'Kopioi kohde',
        confirmReplace: {
            body: 'Haluatko varmasti korvata aiemman piirroksen?',
            acceptText: 'Korvaa',
            cancelText: 'Peruuta',
        },
        editFeature: 'Muokkaa kohdetta',
        confirmEditReplace: {
            body: 'Haluatko varmasti hylätä aiemmat muutokset?',
            acceptText: 'Hylkää',
            cancelText: 'Peruuta',
        },
    },
    modalFilter: {
        title: 'Suodata sarakkeita',
        description: 'Suodatus kohdistuu vain aktiivisena olevaan tauluun.',
        selectAll: 'Valitse kaikki sarakkeet',
        selectNone: 'Tyhjennä valitut sarakkeet',
        submit: 'Suodata',
        cancel: 'Peruuta',
    },
    modalClearTable: {
        submit: 'Tyhjennä',
        cancel: 'Peruuta',
        content: 'Haluatko tyhjentää kaikki taulut ja hakutulokset karttatasovalikosta?',
    },
    modalClearTableTab: {
        submit: 'Tyhjennä',
        cancel: 'Peruuta',
        content: 'Haluatko tyhjentää valitsemasi tason taulukosta?',
        info: 'Poista taso...',
    },
    modalDownloadCsv: {
        all: 'Kaikki kohteet',
        selected: 'Valitut kohteet',
        title: 'CSV -tiedoston lataus',
        description: 'CSV -tiedoston lataus kohdistuu vain aktiivisena olevaan tauluun.',
        cancel: 'Peruuta',
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
        title: 'Määritä kohteiden puskurialue',
        titleSingleFeature: 'Määritä kohteen puskurialue',
        submit: 'Laske',
        cancel: 'Peruuta',
        bufferLabel: 'Puskurialueen koko metreinä',
        tableLabel: 'Taulut',
        featureLabel: 'Kohteet',
        description: 'Määritä puskurialue halutuille kohteille. Puskurointi kohdistuu oletuksena kaikkiin taulussa oleviin kohteisiin.',
        checkTable: 'Vain aktiivinen taulu',
        checkFeature: 'Vain valitut kohteet',
    },
    modalExtractSelectedData: {
        title: 'Vie valitut kohteet toiseen paikkatietoformaattiin',
        description: 'Toiminto kohdistuu vain aktiivisessa taulussa oleviin valittuihin kohteisiin.',
        submit: 'Vie',
        cancel: 'Peruuta',
        geodatabase: '.gdb',
        shapefile: '.shp',
        autocadDxf: '.dxf',
        autocadDwg: '.dwg',
        bentley: '.dgn',
        outputEmpty: 'Ei vietyjä kohteita',
        outputSuccess: 'Lataa kohteet',
        outputError: 'Kohteiden vienti epäonnistui.',
        outputName: 'kohteet.zip',
    },
    modalLayerDetails: {
        title: 'Luo uusi kohde',
        editTitle: 'Muokkaa kohdetta',
        submit: 'Luo',
        editSubmit: 'Tallenna',
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
        queryColumns: 'Hakusarakkeet',
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
            queryColumns: 'Sarake, josta voidaan tehdä haku, erotellaan pilkulla mikäli monta saraketta',
            styles: 'Tason tyylit',
        },
    },
    modalShapefile: {
        title: 'Shapefile tason tuonti',
        submitText: 'Lisää taso',
        cancelText: 'Kumoa',
        readError: 'Shapefile tason tuonti epäonnistui.',
        layerExists: 'Shapefile tason tuonti epäonnistui. Sovelluksessa on jo samanniminen taso',
    },
    modalThemeLayer: {
        title: 'Luo teemataso',
        submit: 'Luo',
        reset: 'Palauta oletusteema',
        cancel: 'Peruuta',
        column: 'Luokiteltava sarake',
        classificationType: 'Luokituksen tyyppi',
        equalInterval: 'Tasavälit (equal interval)',
        naturalBreaks: 'Luonnolliset luokkavälit (natural breaks)',
        quantile: 'Kvantiili (quantile)',
        standardDeviation: 'Keskihajonta (standard deviation)',
        numClasses: 'Välien lukumäärä',
        infoTooltip: 'Lukumäärän tulee olla välillä 1-10.',
    },
    sideNav: {
        search: 'Haku',
        layerManagement: 'Aineistot',
        fileExport: 'Tiedostojen vienti',
        workspace: 'Työtilat',
        offline: 'Offline-käyttö',
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
        rejectSelection: 'Hylkää geometria',
        acceptSelection: 'Hyväksy geometria',
        activeAdmin: 'Luontityökalu',
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
        titlePublicWorkspace: 'Yhteiset työtilat',
        titleUserWorkspace: 'Omat työtilat',
        newWorkspace: 'Luo uusi työtila',
        replaceWorkspace: 'Korvaa työtila',
        deleteWorkspace: 'Poista työtila',
        workspaceLoaded: 'Ladattu työtila.',
        loadingWorkspace: 'Ladataan työtilaa',
        workspaceCreated: 'Luotu työtila.',
        workspaceCreatedError: 'Työtilan luonti epäonnistui.',
        confirmDelete: {
            body: 'Haluatko varmasti poistaa valitun työtilan?',
            acceptText: 'Poista',
            cancelText: 'Peruuta',
            workspaceDeleted: 'Poistettu työtila.',
            workspaceDeletedError: 'Työtilan poisto epäonnistui.',
        },
        confirmReplace: {
            body: 'Haluatko varmasti korvata valitun työtilan?',
            acceptText: 'Korvaa',
            cancelText: 'Peruuta',
            workspaceReplaced: 'Korvattu työtila.',
            workspaceReplacedError: 'Työtilan korvaus epäonnistui.',
        },
        confirmSelect: {
            body: 'Haluatko avata valitun työtilan?',
            acceptText: 'Avaa',
            cancelText: 'Peruuta',
        },
        share: {
            copyWorkspaceLink: 'Kopioi työtilan linkki',
            copiedWorkspaceLink: 'Kopioitu työtilan linkki leikepöydälle.',
            linkToClipboardError: 'Työtilan linkin kopiointi epäonnistui.',
            sharedWorkspaceLoadError: 'Työtilaa ei löytynyt tai käytetty linkki ei ole enää voimassa.',
        },
    },
    modalNewWorkspace: {
        title: 'Luo uusi käyttäjäkohtainen työtila',
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
        selectTool: 'Piirto- ja mittaustyökalut',
        removeDraw: 'Poista piirrokset',
        toggleMeasurements: 'Näytä/piilota mittaustulokset',
    },
    modalDrawText: {
        title: 'Lisää tekstiä kartalle',
        inputLabel: 'Aseta teksti',
        inputPlaceholder: 'Kartan teksti',
        submitText: 'Ok',
        cancelText: 'Peruuta',
    },
    modalShowAddress: {
        title: 'Osoitetieto',
        noAddressFound: 'Osoitetta ei löytynyt.',
        cancelText: 'Peruuta',
        backText: 'Takaisin',
        road: 'tie',
        part: 'osa',
        lane: 'ajorata',
        distance: 'etäisyys',
    },
    modalFeatureContracts: {
        featureContracts: 'Kohteen sopimukset',
        titleNewContract: 'Luo uusi sopimus kohteelle',
        titleEditContract: 'Muokkaa sopimusta',
        titleContractDetails: 'Sopimuksen tiedot',
        submitLinkToContract: 'Linkitä sopimukseen',
        submitNewContract: 'Uusi sopimus',
        submitSave: 'Tallenna',
        cancelText: 'Peruuta',
        backText: 'Takaisin',
        listView: {
            title: 'Kohteeseen liittyvät sopimukset',
            noContracts: 'Kohteella ei ole vielä sopimuksia, voit luoda uuden sopimuksen kohteelle tai linkittää olemassa olevan sopimuksen kohteelle.',
            features: 'Sopimukseen liittyvät kohteet',
            edit: 'Muokkaa sopimusta',
            unlink: 'Poista sopimuksen linkitys kohteelta',
            caseManagementLink: 'Asianhallinta',
            alfrescoLink: 'Alfresco',
        },
        linkContract: {
            title: 'Sopimuksen linkittäminen',
            submit: 'Linkitä sopimus',
            contractNumber: 'Sopimusnumero',
            noContractFound: 'Sopimusnumerolla ei löytynyt yhtään sopimusta.',
            contractUnlinked: 'Poistettu sopimuksen linkki kohteelta.',
            contractUnlinkError: 'Linkityksen poisto epäonnistui',
            contractLinked: 'Linkki luotu onnistuneesti',
            contractLinkedExists: 'Linkitys on jo olemassa',
            contractLinkedError: 'Linkityksen luonti epäonnistui',
        },
        addEditContract: {
            contractFound: 'täytyy olla yksilöllinen.',
        },
        confirmModalUnlinkContract: {
            submit: 'Poista',
            cancel: 'Peruuta',
            content: 'Haluatko varmasti poistaa sopimuksen linkityksen kohteelta?',
        },
    },
    modalContractDetails: {
        cancelText: 'Peruuta',
        backText: 'Takaisin',
        errorNoFeaturesFound: 'Ei löydettyjä kohteita',
        errorNoAttributesFound: 'Ei löydettyjä tietoja.',
        chooseLayer: 'Valitse lisätieto taso',
        addNewDetail: 'Uusi lisätieto',
        listView: {
            title: 'Sopimukseen liittyvät kohteet',
            details: 'Näytä lisätiedot',
            unlink: 'Poista kohteen linkitys sopimukselta',
            edit: 'Muokkaa kohdetta',
            showLocation: 'Näytä kartalla',
        },
        newDetail: {
            title: 'Lisää uusi kohde sopimukselle',
            submit: 'Tallenna',
            errorAddingFeature: 'Kohteen luonti epäonnistui',
        },
        editFeature: {
            title: 'Muokkaa kohdetta',
            submit: 'Tallenna',
        },
        confirmModalUnlinkContract: {
            content: 'Haluatko varmasti poistaa kohteen linkityksen sopimukselta?',
            submit: 'Poista',
            cancel: 'Peruuta',
            featureUnlinkSuccess: 'Kohteen linkityksen poisto onnistui.',
            featureUnlinkError: 'Kohteen linkityksen poisto epäonnistui.',
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
        createThemeLayer: 'Luo teemataso',
        toggleAdminTool: 'Muokkaus päälle/pois',
        toggleVisibility: 'Näytä/piilota karttataso',
        zoomIn: 'Lähennä karttaa nähdäksesi karttatason',
        zoomOut: 'Loitonna karttaa nähdäksesi karttatason',
    },
    searchProperty: {
        propertyIdentifier: 'Kiinteistötunnus',
        parcelCount: 'Palstojen lukumäärä',
        registerUnitType: 'Rekisteriyksikkölaji',
        municipality: 'Kunta',
        name: 'Nimi',
        landArea: 'Maapinta-ala',
        registrationDate: 'Rekisteröintipvm',
        areaSearch: 'Aluehaku',
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
            searchAreaLimit: 'Kiinteistö aluehaun pinta-ala saa olla korkeintaan: 0,0625 km\xB2. Hakuvyöhyke metreinä saa olla korkeintaan: 250 m.',
        },
    },
    offlineSavedModal: {
        title: 'Offline-muutosten tallennus',
        cancel: 'Sulje',
        text: 'Tallentamattomia muutoksia tallennettu onnistuneesti. Päivitä tarvittavat karttatasot ja taulukot tarvittaessa.',
    },
    offline: {
        title: 'Offline-käyttö',
        edits: {
            title: 'Tallentamattomat muutokset',
            noEdits: 'Ei muutoksia.',
            hasEdits: 'tallentamatonta muutosta.',
            save: 'Tallenna muutokset',
            remove: 'Poista muutokset',
        },
    },
    geocode: {
        placeholder: 'Hae osoitteella tai paikalla',
    },
    shapefileColorView: {
        title: '2) Valitse kohteiden väri',
        customTitle: 'Valitse vapaavalintainen väri',
        selectTitle: 'Valitse väri',
    },
    shapefileDropView: {
        title: '1) Avaa Shapefile -tiedosto',
        selectedFilesText: 'Valitut tiedostot:',
        browse: 'Selaa',
        orText: 'tai',
        dropText: 'Pudota .shp ja .dbf tiedostot tähän',
    },
    property: {
        errorToast: {
            invalidFormat: 'Kiinteistötunnus ei ole oikeassa muodossa.',
            geometryMissing: 'Kiinteistötunnuksella ei ole geometriaa.',
            propertyAlreadyExist: 'Kiinteistötunnus on olemassa jo järjestelmässä.',
        },
    },
    modalZoomToFeatures: {
        modalTitle: 'Kohdista taulukon kohteisiin',
        modalCancel: 'Peruuta',
        modalSubmit: 'Kohdista',
        content: {
            description: 'Kohdista kartta haluttuihin kohteisiin. Kohdistaa oletuksena kaikkiin taulussa oleviin kohteisiin.',
            checkTable: 'Vain aktiivinen taulu',
            checkFeature: 'Vain valitut kohteet',
        },
    },
    portalWindow: {
        portalTitle: 'Taulu - Kiinteistö- ja sopimusrekisteri',
    },
    modalConfirmAdminChange: {
        contentChange: 'Haluatko varmasti vaihtaa ylläpitotilan toiselle tasolle? Menetät kaikki tallentamattomat muutokset.',
        contentDisable: 'Haluatko varmasti poistua ylläpitotilasta? Menetät kaikki tallentamattomat muutokset.',
        cancel: 'Peruuta',
        submitChange: 'Vaihda',
        submitDisable: 'Poistu',
    },
};

export default fi;
