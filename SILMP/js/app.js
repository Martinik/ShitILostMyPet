$(() => {

    let notifications = $(`.notification`)
    notifications.hide();
    notifications.click(function () {
        $(this).hide();
    });

    let shouldInitCustom = true;

    const app = Sammy('#mainContent', function () {

        this.use('Handlebars', 'hbs');

        //Home Page
        this.get('index.html', displayHome);
        this.get('#/index', displayHome);
        this.get('#/home', displayHome);

        //Login Page
        this.get('#/login', displayLogin);
        this.post('#/login', postLogin);

        //Register Page
        this.get('#/register', displayRegister);
        this.post('#/register', postRegister);

        //Logout
        this.get('#/logout', logoutUser);

        //Explore Pages
        this.get('#/explore', displayExplore);
        this.get('#/explore/lost', displayExploreLost);
        this.get('#/explore/found', displayExploreFound);

        //Create Poster Pages
        this.get('#/createLostPoster', displayCreateLostPoster);
        this.post('#/createLostPoster', postCreateLostPoster);

        this.get('#/createFoundPoster', displayCreateFoundPoster);
        this.post('#/createFoundPoster', postCreateFoundPoster);

        $("#editProfile").click(editUserInfo);
        this.get('#/userProfile', displayUserProfile);


        //Pet Details
        this.get('#/petDetails/lost/:petId', displayLostPetDetails);
        this.get('#/petDetails/found/:petId', displayFoundPetDetails);


        // functions

        function displayLostPetDetails(ctx) {
            petsService.getLostPetById(ctx.params.petId).then(function (petData) {
                    ctx.pets = petData;
                console.log(petData);
                // ctx.loadPartials({
                    //     userDropDown: '../templates/common/userDropDown.hbs',
                    //     enterDropDown: '../templates/common/enterDropDown.hbs',
                    //     header: '../templates/common/header.hbs',
                    //     footer: '../templates/common/footer.hbs',
                    //     scrollTop: '../templates/common/scrollTop.hbs',
                    //     exploreScript: '../templates/explore/exploreScript.hbs',
                    //
                    //     petThumbnail: '../templates/explore/petThumbnail.hbs'
                    //
                    // }).then(function () {
                    //     this.partial('../templates/explore/explorePage.hbs')
                    // }).then(startPageScript)
                    //     .catch(auth.handleError);
            })
        }

        function displayFoundPetDetails(ctx) {

        }

        function postCreateFoundPoster(ctx) {
            // let imgSrc = ctx.params.base64Image;
            let petType = ctx.params.petType;
            let petBreed = ctx.params.petBreed;
            let petGender = ctx.params.petGender;
            let petInformation = ctx.params.petInformation;
            let lat = ctx.params.lat;
            let lng = ctx.params.lng;
            let radius = ctx.params.rad;

            let thumbnailURL = ctx.params.thumbnailURL;
            let thumbnailId = ctx.params.thumbnailId;

            let lostPetData = {
                petType,
                petBreed,
                petGender,
                petInformation,
                thumbnailURL,
                thumbnailId,
                lat,
                lng,
                radius

            };

            requester.post("appdata", "foundPets", "kinvey", lostPetData)
                .then(function () {
                    auth.showInfo('Created Lost Pet Poster!');
                    displayHome(ctx);
                })
                .catch(auth.handleError);
        }

        function postCreateLostPoster(ctx) {

            let petName = ctx.params.petName;
            // let imgSrc = ctx.params.base64Image;
            let petType = ctx.params.petType;
            let petBreed = ctx.params.petBreed;
            let petGender = ctx.params.petGender;
            let petInformation = ctx.params.petInformation;
            let lat = ctx.params.lat;
            let lng = ctx.params.lng;
            let radius = ctx.params.rad;

            let thumbnailURL = ctx.params.thumbnailURL;
            let thumbnailId = ctx.params.thumbnailId;

            console.log(thumbnailId);
            console.log(thumbnailURL);


            let lostPetData = {
                petName,
                petType,
                petBreed,
                petGender,
                petInformation,
                thumbnailURL,
                thumbnailId,
                lat,
                lng,
                radius
            };

            requester.post("appdata", "lostPets", "kinvey", lostPetData)
                .then(function () {
                    auth.showInfo('Created Lost Pet Poster!');
                    displayHome(ctx);
                })
                .catch(auth.handleError);
        }

        function displayCreateLostPoster(ctx) {
            ctx.loadPartials({
                userDropDown: '../templates/common/userDropDown.hbs',
                enterDropDown: '../templates/common/enterDropDown.hbs',
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs',
                scrollTop: '../templates/common/scrollTop.hbs',
                scripts: '../templates/common/scripts.hbs',

                createLostForm: '../templates/createLostPoster/createLostForm.hbs',
                createLostPosterScript: '../templates/createLostPoster/createLostPosterScript.hbs'
            }).then(function () {
                this.partial('../templates/createLostPoster/createLostPage.hbs')
            })
        }

        function displayCreateFoundPoster(ctx) {
            ctx.loadPartials({
                userDropDown: '../templates/common/userDropDown.hbs',
                enterDropDown: '../templates/common/enterDropDown.hbs',
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs',
                scrollTop: '../templates/common/scrollTop.hbs',
                scripts: '../templates/common/scripts.hbs',

                createFoundForm: '../templates/createFoundPoster/createFoundForm.hbs',
                createFoundPosterScript: '../templates/createFoundPoster/createFoundPosterScript.hbs'
            }).then(function () {
                this.partial('../templates/createFoundPoster/createFoundPage.hbs')
            })
        }

        function displayExploreFound(ctx) {

            $(`#loadingBox`).show();

            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.firstName = sessionStorage.getItem('firstName');
            ctx.lastName = sessionStorage.getItem('lastName');
            ctx.email = sessionStorage.getItem('email');

            petsService.loadFoundPets(16).then(function (foundPetsData) {

                ctx.pets = foundPetsData;

                ctx.loadPartials({
                    userDropDown: '../templates/common/userDropDown.hbs',
                    enterDropDown: '../templates/common/enterDropDown.hbs',
                    header: '../templates/common/header.hbs',
                    footer: '../templates/common/footer.hbs',
                    scrollTop: '../templates/common/scrollTop.hbs',
                    scripts: '../templates/common/scripts.hbs',

                    petThumbnail: '../templates/explore/petThumbnail.hbs'

                }).then(function () {
                    this.partial('../templates/explore/exploreFoundPage.hbs')
                }).then(startPageScript)
                    .catch(auth.handleError);
            });

            function startPageScript() {
                $(`#loadingBox`).fadeOut()
                let loadMoreLink = $(`#loadMore`);
                loadMoreLink.click(loadMorePets);
                function loadMorePets() {
                    console.log('TODO: load more pets');
                    //TODO
                }
            }
        }

        function displayExploreLost(ctx) {

            $(`#loadingBox`).show();

            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.firstName = sessionStorage.getItem('firstName');
            ctx.lastName = sessionStorage.getItem('lastName');
            ctx.email = sessionStorage.getItem('email');

            petsService.loadLostPets(16).then(function (lostPetsData) {

                ctx.pets = lostPetsData;

                ctx.loadPartials({
                    userDropDown: '../templates/common/userDropDown.hbs',
                    enterDropDown: '../templates/common/enterDropDown.hbs',
                    header: '../templates/common/header.hbs',
                    footer: '../templates/common/footer.hbs',
                    scrollTop: '../templates/common/scrollTop.hbs',
                    scripts: '../templates/common/scripts.hbs',

                    petThumbnail: '../templates/explore/petThumbnail.hbs'

                }).then(function () {
                    this.partial('../templates/explore/exploreLostPage.hbs')
                }).then(startPageScript)
                    .catch(auth.handleError);
            });

            function startPageScript() {
                $(`#loadingBox`).fadeOut()
                let loadMoreLink = $(`#loadMore`);
                loadMoreLink.click(loadMorePets);
                function loadMorePets() {
                    console.log('TODO: load more pets');
                    //TODO
                }
            }
        }

        function displayExplore(ctx) {

            $(`#loadingBox`).show();

            let searchPetType = 'all';

            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.firstName = sessionStorage.getItem('firstName');
            ctx.lastName = sessionStorage.getItem('lastName');
            ctx.email = sessionStorage.getItem('email');

            let lostPets = [];
            let foundPets = [];
            let allPets = [];

            petsService.loadLostPets(8).then(function (lostPetsData) {
                petsService.loadFoundPets(8).then(function (foundPetsData) {
                    lostPets = lostPetsData;
                    foundPets = foundPetsData;
                    allPets.push.apply(allPets, lostPets);
                    allPets.push.apply(allPets, foundPets);


                    allPets.sort(function(a, b) {

                        return (b._kmd.ect) - (a._kmd.ect);
                    });

                    ctx.pets = allPets;

                    ctx.loadPartials({
                        userDropDown: '../templates/common/userDropDown.hbs',
                        enterDropDown: '../templates/common/enterDropDown.hbs',
                        header: '../templates/common/header.hbs',
                        footer: '../templates/common/footer.hbs',
                        scrollTop: '../templates/common/scrollTop.hbs',
                        exploreScript: '../templates/explore/exploreScript.hbs',

                        petThumbnail: '../templates/explore/petThumbnail.hbs'

                    }).then(function () {
                        this.partial('../templates/explore/explorePage.hbs')
                    }).then(startPageScript)
                        .catch(auth.handleError);


                })
            });


            function startPageScript() {
                $(`#loadingBox`).fadeOut()
                let loadMoreLink = $(`#loadMore`);
                loadMoreLink.click(loadMorePets);

                function loadMorePets() {
                    console.log('TODO: load more pets');
                    //TODO
                }
            }
        }


        function logoutUser(ctx) {
            auth.logout()
                .then(function () {
                    sessionStorage.clear();
                    auth.showInfo('Logged Out!');
                    displayHome(ctx);
                })
                .catch(auth.handleError);
        }

        function postLogin(ctx) {

            let username = ctx.params.username;
            let password = ctx.params.password;

            auth.login(username, password)
                .then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('Logged In!');
                    displayHome(ctx);
                })
                .catch(auth.handleError);

        }


        function postRegister(ctx) {
            let firstName = ctx.params.firstName;
            let lastName = ctx.params.lastName;
            let email = ctx.params.email;
            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPassword = ctx.params.repeatPassword;

            if (password !== repeatPassword) {
                auth.showError('Passwords do not match!')
            }
            else {
                auth.register(username, password, firstName, lastName, email)
                    .then(function (userInfo) {
                        auth.saveSession(userInfo);
                        auth.showInfo('Registered!');
                        displayHome(ctx);
                    })
                    .catch(auth.handleError);
            }
        }

        function displayRegister(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.firstName = sessionStorage.getItem('firstName');
            ctx.lastName = sessionStorage.getItem('lastName');
            ctx.email = sessionStorage.getItem('email');

            ctx.loadPartials({
                userDropDown: '../templates/common/userDropDown.hbs',
                enterDropDown: '../templates/common/enterDropDown.hbs',
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs',
                scrollTop: '../templates/common/scrollTop.hbs',
                scripts: '../templates/common/scripts.hbs',

                registerForm: '../templates/register/registerForm.hbs'

            }).then(function () {
                this.partial('../templates/register/registerPage.hbs')
            })
        }

        function displayLogin(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.firstName = sessionStorage.getItem('firstName');
            ctx.lastName = sessionStorage.getItem('lastName');
            ctx.email = sessionStorage.getItem('email');

            ctx.loadPartials({
                userDropDown: '../templates/common/userDropDown.hbs',
                enterDropDown: '../templates/common/enterDropDown.hbs',
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs',
                scrollTop: '../templates/common/scrollTop.hbs',
                scripts: '../templates/common/scripts.hbs',

                loginForm: '../templates/login/loginForm.hbs'

            }).then(function () {
                this.partial('../templates/login/loginPage.hbs')
            })
        }

        function editUserInfo() {
            let userInfo = $('#editForm').serializeArray().map(function (x) {
                data[x.name] = x.value;
            });

            let userid = sessionStorage.getItem('userId');

            return requester.update('user', userid, 'kinvey', userInfo).then(
                displayUserProfile(ctx)
            );

        }

        function displayUserProfile(ctx) {
            $(`#loadingBox`).show();

            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.firstName = sessionStorage.getItem('firstName');
            ctx.lastName = sessionStorage.getItem('lastName');
            ctx.email = sessionStorage.getItem('email');

            ctx.loadPartials({
                userDropDown: '../templates/common/userDropDown.hbs',
                enterDropDown: '../templates/common/enterDropDown.hbs',
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs',
                scrollTop: '../templates/common/scrollTop.hbs',
            }).then(function () {
                this.partial('../templates/home/userProfilePage.hbs')
            }).catch(auth.handleError);

        }

        function displayHome(ctx) {
            ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
            ctx.username = sessionStorage.getItem('username');
            ctx.firstName = sessionStorage.getItem('firstName');
            ctx.lastName = sessionStorage.getItem('lastName');
            ctx.email = sessionStorage.getItem('email');

            // template variables

            // hardcoded variables for testing
            // remove after adding database!
            let lostPets = [];
            let lostPet1 = {
                imageData: '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',
                name: 'hardCoded1'
            };
            let lostPet2 = {
                imageData: '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AG7lABNVAEAZwDtEL0GBLwwEPRMAMBCgArgNBftooAAYnCsRABSAYAtfQGMgEz+F+cF0CfxMP7xAJ1AAbkAJBoCFSIF94BYAA0QHwpdGYA3UgZlGEFjPEoBRMXuYA4ehfAkgoADRYCBJAcWDlAgAqBQKGB6GIAeDZgAEFCo3TKAR10uwxChVKNAQBCADgAE0hADoCApACcCAJMApCIQCFykCH4Nw4ABsSuHSMeZkTUAAskRAzAABIEgfYDBEAqAiTIAMIYhYAChhAOihB/IQgJEoAiBBAAE+k/cf4sJ9I9kH44AByQ4AWKBWABDCBFVAHTICAEelQEAOAQPZNANA4BaD0JUMclYACAgILLP2iaiFGHzpgyeFbWYAKKCA2QA2QAAFjkBTRAgU6ZIAASHjXABwQC/AEAB+IAwYQBvwAAHTRgAAkC8Ag8BN6WAREROqQIAdl9IbPsICx1G/6GAkRTAJ1AE+GRAD851Pkp/gHCAHQkByEGMABgGCDgQ4FALHAFAhIjQQT5tU4gBCBUAFJAKN4BgIAGyDAIbgNBCMhQAAI8lOYCIUISsUCYRBIhIwZgNgBYACAZkCSQiFIDIgADmAAgAmAIEsAKCyMAQAhAAoGAAgRXAAEUAQAEEwDEBPAYBguoBEEEACQQ7kGBoBAAAIAEAECCkyUYGDhgkJGgNBEMiikaBSSOAEIBRAgDhBD0sFIwgwAg7h6aDIRiBAIIAEHBA6QMQywSECKpRJkSBEjgAATzgEvFBUpgIgQAiKpEWRgcwwUAIQQl0ATAYS6CAmoIA8UJCYdRISdqCCqAgsRAJZXACGgQERIFSjFESChBQISJwCCoQRCrAAgApHoCAaDcgBRIFBYUKUlkSAgNAFAoGBOAA4f//ZICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIA==',
                name: 'hardCoded2'
            };
            lostPets.push(lostPet1);
            lostPets.push(lostPet2);

            //

            let foundPets = [];
            let foundPet1 = {
                imageData: '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',
                type: 'hardCoded1'
            };
            let foundPet2 = {
                imageData: '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',
                type: 'hardCoded2'
            };
            foundPets.push(foundPet1);
            foundPets.push(foundPet2);
            //

            ctx.lostPets = lostPets;
            ctx.foundPets = foundPets;


            // #template variables
            ctx.loadPartials({
                userDropDown: '../templates/common/userDropDown.hbs',
                enterDropDown: '../templates/common/enterDropDown.hbs',
                header: '../templates/common/header.hbs',
                footer: '../templates/common/footer.hbs',
                scrollTop: '../templates/common/scrollTop.hbs',
                scripts: '../templates/common/scripts.hbs',
                mapScript: '../templates/home/mapScript.hbs',

                welcomeSection: '../templates/home/welcomeSection.hbs',
                aboutSection: '../templates/home/aboutSection.hbs',
                carouselLostPet: '../templates/home/carouselLostPet.hbs',
                carouselFoundPet: '../templates/home/carouselFoundPet.hbs',
                lostPetsCarousel: '../templates/home/lostPetsCarousel.hbs',
                foundPetsCarousel: '../templates/home/foundPetsCarousel.hbs',
                mapSection: '../templates/home/mapSection.hbs',
                contactSection: '../templates/home/contactSection.hbs'
            }).then(function () {
                this.partial('../templates/home/homePage.hbs').then(function () {
                    if (shouldInitCustom) {
                        templateCustom();
                        shouldInitCustom = false;
                    }
                })
            })

        }

    });
    app.run();
});
