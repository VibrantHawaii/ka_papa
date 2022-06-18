import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';

// let stillLoadingPageData = true;
// let stillLoadingPageDataAnimationStage = 3; // 1, 2, or 3. Start at 3 to immediately cause wrap around to 1 on instantiation.
// const BASE_LOADING_ANIMATION_TEXT = "Searching the island.";

$w.onReady(function () {
    let courseMap = [];
    let courseResults = {};

    // loadingPageDataAnimation();

    // let params = (new URL(wixLocation.url)).searchParams;
    // if (params.has("regions")) {
    //     regions = params.get("regions");
    // }
    // if (params.has("badges")) {
    //     badges = params.get("badges");
    // }

    wixData.query("Courses")
        .find()
        .then( (courseResults) => {
            if (courseResults.length == 0) {
                console.error("ERROR - NO COURSES FOUND")
                return;
            }

            $w("#coursesRepeater").data = courseResults.items.map((courseItem) => {
                return {
                    "_id":courseItem._id,
                    "image": courseItem.image,
                    "title": courseItem.title,
                    "subTitle": courseItem.subTitle,
                    "teachableURL": courseItem.teachableCoursePageUrl
                };
            });

            // $w("#statusText").hide();

            // $w("#coursesRepeater").data = dataArray;
            // $w("#loadingAnimationText").hide();
            // stillLoadingPageData = false;
            $w("#resultsContainerBox").show();
        });

    $w("#coursesRepeater").onItemReady(($item, itemData, index) => {
        $item("#title").text = itemData.title;
        $item("#subTitle").text = itemData.subTitle;
        $item("#thumbnail").src = itemData.image;

        // $w("#thumbnail").link = itemData.teachableURL;
        $w("#thumbnail").target = "_blank";

        function gotoTeachableCoursePage(event) {
            wixLocation.to(itemData.teachableURL);
        }

        $item("#title").onClick( (event) => {
            gotoTeachableCoursePage(event);
        });

        $item("#subTitle").onClick( (event) => {
            gotoTeachableCoursePage(event);
        });

        $item("#thumbnail").onClick((event) => {
            gotoTeachableCoursePage(event);
        });
    });

});

// function loadingPageDataAnimation() {
//     if (stillLoadingPageData) {
//         // Requeue animation
//         let newText = BASE_LOADING_ANIMATION_TEXT;
//         switch (stillLoadingPageDataAnimationStage) {
//             case 1:
//                 stillLoadingPageDataAnimationStage++;
//                 break;
//             case 2:
//                 stillLoadingPageDataAnimationStage++;
//                 newText = newText + "."
//                 break;
//             case 3:
//                 stillLoadingPageDataAnimationStage = 1;
//                 newText = newText + ".."
//                 break;
//         }

//         $w("#loadingAnimationText").text = newText;
//         setTimeout(loadingPageDataAnimation, 700);
//     }
// }