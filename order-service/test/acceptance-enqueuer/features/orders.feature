Feature: Order Checkout for my Order Service

  Scenario: Checkout request for a given order
    Given I have an order to buy on my store
    When I start the checkout process
    Then I should call the checkout service
