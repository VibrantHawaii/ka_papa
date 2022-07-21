import wixWindow from 'wix-window';

let recommendedResources = [];

let htmlScriptHeader = `<script type="text/javascript">
  function openFirstTab(evt, tabName, tabClass) {
    openTab(evt, tabName);
    var firstTab = document.getElementsByClassName(tabClass);
    firstTab[0].className += " active";
  }

  function openTab(evt, tabName) {
    // Declare all variables
    let i, tabContent, tabLinks;

    // Get all elements with class="tabContent" and hide them
    tabContent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabContent.length; i++) {
      tabContent[i].style.display = "none";
    }

    // Get all elements with class="tabLinks" and remove the class "active"
    tabLinks = document.getElementsByClassName("tabLinks");
    for (i = 0; i < tabLinks.length; i++) {
      tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  function openDropdown(evt, dropdownId) {
    let targetDropdown;
    if (dropdownId === 'communityDiscussion') {
      targetDropdown = document.getElementsByClassName("comments");
      targetDropdown[0].style.display = "block";
    }
    if (dropdownId === 'recommendedResources') {
      targetDropdown = document.getElementsByClassName("recommendedResourcesContent");
      targetDropdown[0].style.display = "block";
    }
  }

</script>
`;

let tabLinksHeader = `

<!-- Tab links -->
<div class="tab">
`;

function generateTabHTML(tabType, label) {
    return `  <button class="tabLinks ${tabType}" onclick="openTab(event, '${tabType}')">${label}</button>
`;
}

let tabLinksFooter = `</div>

<!-- Tab content -->
`;

function generateOverviewTabHTML(overviewText) {
    return `  <div id="overview" class="tabContent">
    <h3 class="tabTitle">Overview</h3>
    <p>${overviewText}</p>
  </div>
`;
}

function generateTranscriptTabHTML(url) {
    return `
  <div id="transcript" class="tabContent">
  <h3 class="tabTitle">Transcript</h3>
  <p>Download the transcript in PDF form.</p>
  <a class="downloadBtn" data-cpl-tooltip="Download the transcript in PDF form."
     data-vpl-tooltip="Download the transcript in PDF form."
     href="${url}"
     id="download_transcript_button" role="button">
    <span class="nav-text">Download Transcript</span>
  </a>
</div>
`;
}

function generateAudioTabHTML(url) {
    return `
<div id="audio" class="tabContent">
  <h3 class="tabTitle">Audio</h3>
  <p>Download the audio in MP3 format.</p>
  <a class="downloadBtn" data-cpl-tooltip="Download the audio in MP3 format."
     data-vpl-tooltip="Download the audio in MP3 format."
     href="${url}" id="download_audio_button"
     role="button">
    <span class="nav-text">Download Audio</span>
  </a>
</div>
`;
}

function generateDefaultTabOnload(tabType) {
    return `
<body onload="openFirstTab(event, '${tabType}', 'tablinks ${tabType}')">
`;
}

let recommendedResourcesHeader = `
<div id="recommendedResources" class="dropdownSection">
  <div class="dropdownTitle">
    <button class="dropdownLinks recommendedResources" onclick="openDropdown(event, 'recommendedResources')">
      Recommended Resources ▼
    </button>
  </div>
  <div class="dropdownContent recommendedResourcesContent">
    <ul>
`;

function generateRecommendedResourceHTML(resource) {
    return `      <li class="dropdownLink"><a
        href="${resource.url}">${resource.caption}</a></li>
`;
}

let recommendedResourcesFooter = `    </ul>
  </div>
</div>

`;

let discussionSection = `
<div id="communityDiscussion" class="dropdownSection">
  <div class="dropdownTitle">
    <button class="dropdownLinks communityDiscussion" onclick="openDropdown(event, 'communityDiscussion')">Community
      Discussion ▼
    </button>
  </div>
</div>
`;

$w.onReady(function () {
    $w('#includeOverviewCheckbox').onChange(e => {
        if ($w('#includeOverviewCheckbox').checked) {
            $w('#overviewBox').expand();
            $w('#overviewBox').show();
        } else {
            $w('#overviewBox').hide();
            $w('#overviewBox').collapse();
        }
    })

    $w('#includeTranscriptCheckbox').onChange(e => {
        if ($w('#includeTranscriptCheckbox').checked) {
            $w('#transcriptBox').expand();
            $w('#transcriptBox').show();
        } else {
            $w('#transcriptBox').hide();
            $w('#transcriptBox').collapse();
        }
    })

    $w('#includeAudioCheckbox').onChange(e => {
        if ($w('#includeAudioCheckbox').checked) {
            $w('#audioBox').expand();
            $w('#audioBox').show();
        } else {
            $w('#audioBox').hide();
            $w('#audioBox').collapse();
        }
    })

    $w('#addResourceButton').onClick(e => {
        $w("#resourcesRepeater").forEachItem(($item, itemData, index) => {
            recommendedResources[index].caption = $item('#captionInput').value;
            recommendedResources[index].url = $item('#urlLinkInput').value;
        });
        $w('#resourcesRepeater').data = [];
        const dateTime = new Date().valueOf();
        recommendedResources.push({ _id: dateTime.toString(), caption: "", url: "" });
        $w('#resourcesRepeater').data = recommendedResources;
    })

    $w("#resourcesRepeater").onItemReady(($item, itemData, index) => {
        $item("#captionInput").value = itemData.caption;
        $item("#urlLinkInput").value = itemData.url;

        $item("#captionInput").onKeyPress(e => {
            recommendedResources.forEach((resource, index) => {
                if (resource._id === e.context.itemId)
                    recommendedResources[index].caption = $item("#captionInput").value;
            })
        })

        $item("#urlLinkInput").onKeyPress(e => {
            recommendedResources.forEach((resource, index) => {
                if (resource._id === e.context.itemId)
                    recommendedResources[index].url = $item("#urlLinkInput").value;
            })
        })

        $item('#deleteResourceButton').onClick(e => {
            recommendedResources = recommendedResources.filter(item => item._id !== e.context.itemId);
            $w('#resourcesRepeater').data = recommendedResources;
        })
    });

    $w('#resourcesRepeater').data = recommendedResources;

    $w('#generateButton').onClick(e => {
        let outputText = "";
        outputText = outputText + htmlScriptHeader;

        if ($w('#includeOverviewCheckbox').checked || $w('#includeTranscriptCheckbox').checked || $w('#includeAudioCheckbox').checked) {
            outputText = outputText + tabLinksHeader;
            if ($w('#includeOverviewCheckbox').checked)
                outputText = outputText + generateTabHTML("overview", "Overview");
            if ($w('#includeTranscriptCheckbox').checked)
                outputText = outputText + generateTabHTML("transcript", "Transcript");
            if ($w('#includeAudioCheckbox').checked)
                outputText = outputText + generateTabHTML("audio", "Audio");
            outputText = outputText + tabLinksFooter;
            if ($w('#includeOverviewCheckbox').checked)
                outputText = outputText + generateOverviewTabHTML($w('#overviewTextBox').value);
            if ($w('#includeTranscriptCheckbox').checked)
                outputText = outputText + generateTranscriptTabHTML($w('#transcriptUrlText').value);
            if ($w('#includeAudioCheckbox').checked)
                outputText = outputText + generateAudioTabHTML($w('#audioUrlText').value);

            if ($w('#includeOverviewCheckbox').checked)
                outputText = outputText + generateDefaultTabOnload("overview");
            else {
                if ($w('#includeTranscriptCheckbox').checked)
                    outputText = outputText + generateDefaultTabOnload("transcript");
                else
                    outputText = outputText + generateDefaultTabOnload("audio");
            }
        }

        if (recommendedResources.length > 0) {
            outputText = outputText + recommendedResourcesHeader;
            recommendedResources.forEach(resource => {
                outputText = outputText + generateRecommendedResourceHTML(resource);
            });
            outputText = outputText + recommendedResourcesFooter;
        }

        if ($w('#discussionCheckbox').checked)
            outputText = outputText + discussionSection;

        wixWindow.copyToClipboard(outputText)
            .then(() => {})
            .catch((err) => {});
    })
});