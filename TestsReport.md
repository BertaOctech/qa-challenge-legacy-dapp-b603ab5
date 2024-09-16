# QA Engineer Technical Challenge Response Report

Report corresponding to QA Engineer Technical Challenge as described in
https://github.com/JoinColony/qa-challenge-legacy-dapp-b603ab5

15 September 2024
Berta Guzmán de la Mata (bertaguz@gmail.com)

## General comments

I have written simple tests to cover the given instructions.

There is one playwright test for each section of the instructions and in general one test for each requirement.

The "List" and "Individual Item" requirements were straightforward but I encountered some problems with the "Filtering and Sorting" and the "Loading" sections. I detailled them below.

I started working on the Bonus Points, but I did not complete all the requirements due to lack of time.

## Filtering and sorting

I had problems testing the filtering and sort component.

### Manual testing

As I was having some problems automating, I carried out some manual tests and I found some issues:

- Both for the date sorting and the type filter, the first time an option is selected the button text does not change and the text ' selected' is not added to the selected option. If the user selects the option a second time then the texts change.
- For the date sorting I was not able to assess if the sorting is correct or not. Even if only the day and month is shown to the user I would expect the year to be present somewhere in the DOM, an attribute perhaps.
- For the type filter, if we select a type that returns no items (ex: Generic), the filter component d	disappears and it is no possible to unfilter; as a user it is necessary to reload the page.

### Playwright tests

I have been able to interact with the button which shows and hides the list of options and to prepare a test which detects the text has not changed.

However, I have not been able to interact correctly with the options. When I click in the option the options list is hidden but the actions list does not change. 

I have tried several types of locators, several ways to dispatch the event and I have been careful to use the DOM element which have the event attached but I did not succeed in altering the list items.

I suspect I need to add something to my tests to dispatch the event correctly but I did not found what exactly. I am afraid I have experience with vuejs applications but not with React applications.

## Loading

I have been able to write a playwright test which verifies the correct behaviour of the "Load More" button.
However, I did not manage to test the loader component is rendered.
I tried to set conditions for it to appear (slow browser response, emulate internat failure) but it did not work. 
I had the same problems to account for loading errors. If I had managde to make the filters working I could have altered the dom and send a non existing criterium or something like that, but it did not happened.

## Playwright tests report

This is the resut of running the tests I have finally written:

<div>
  <img width="210" src="../.assets/playright-tests-report.jpg" alt="Playwright tests report" title="Playwright tests report"/>
</div>
