
describe('Test the client view', function () {
  var page;

  var hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
        return classes.split(' ').indexOf(cls) !== -1;
    });
  };

  beforeEach(function () {
    browser.get('/#/clients');
  });

  it('client navbar should be active', function(done) {
    var navbar = element(by.id('navbar'));
    var navBarLi = navbar.all(by.css('ul li')).then(function(items) {
      expect(items.length).toBe(3);
      expect(hasClass(items[0], 'active')).toBe(true);
      done();
    });
  });

  it('client creation', function(done) {
    var random = Math.floor(Math.random() * 10000) + 1
    var email = 'brian_' + random + '@gmail.com';
    element(by.css('tr.beautiful-header > th > button')).click().then(function(){
      element(by.id('inputName')).sendKeys('Brian Griffin').
        then(function(){
          element(by.id('inputEmail')).sendKeys(email);
        })
        .then(function(){
          element(by.id('inputPhone')).sendKeys('444-4444');
        })
        .then(function(){
          element(by.css('.modal-footer button.btn-primary')).click();
        })
        .then(function(){
          element.all(by.css('tbody tr')).then(function(clients){
            expect(clients.length > 0).toBeTruthy();
            var clientsLen = clients.length;
            var client = clients[clientsLen - 1]
            client.all(by.css('td')).then(function(clientTds){
              expect(clientTds.length).toBe(5);
              expect(clientTds[0].getText()).toEqual('Brian Griffin');
              expect(clientTds[1].getText()).toEqual(email);
              expect(clientTds[2].getText()).toEqual('444-4444');
              clientTds[4].element(by.css('.btn-danger')).click().then(function(){
                element.all(by.css('tbody tr')).then(function(clients){
                  expect(clients.length < clientsLen).toEqual(true);
                  done();
                })
              });
            });
          });
        });
      });
    });

  });
