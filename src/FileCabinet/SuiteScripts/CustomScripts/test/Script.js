require(['SuiteScripts/CustomScripts/Coda/api/coda'], function (coda) {
  function test() {
    var id = coda.addGoal({
      data: {
        id: 2,
        name: 'Awareness to Hire',
        employee: 'JC Duarte',
        details: null,
        status: 'Canceled',
        startdate: '1-Apr-2021',
        targetdate: '30-Jun-2021',
        closeddate: '11-Oct-2021',
        mood: 'Not Set',
        areaoffocus: 'TBA',
        class: 'Professional Services',
        department: 'Services',
        location: 'San Francisco Bay Area',
        lineofbusiness: 'Professional Services',
      },
    });

    var x = 1;
  }

  test();
});
