package com.pjplastic.pjplastic_backend.controller;

import com.pjplastic.pjplastic_backend.dto.CreateCustomerDto;
import com.pjplastic.pjplastic_backend.dto.UpdateCustomerDto;
import com.pjplastic.pjplastic_backend.entity.CustomerEntity;
import com.pjplastic.pjplastic_backend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerEntity>> getAllCustomers() {
        List<CustomerEntity> customers = customerService.getAllCustomers();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerEntity> getCustomerById(@PathVariable("id") Integer customerId) {
        Optional<CustomerEntity> customer = customerService.getCustomerById(customerId);
        return customer.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<CustomerEntity> createCustomer(@RequestBody CreateCustomerDto createCustomerDto) {
        try {
            CustomerEntity createdCustomer = customerService.createCustomer(createCustomerDto);
            return ResponseEntity.status(201).body(createdCustomer);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerEntity> updateCustomer(@PathVariable("id") Integer customerId, @RequestBody UpdateCustomerDto updateCustomerDto) {
        try {
            CustomerEntity updatedCustomer = customerService.updateCustomer(customerId, updateCustomerDto);
            return ResponseEntity.ok(updatedCustomer);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Customer not found")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.status(400).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable("id") Integer customerId) {
        try {
            boolean deleted = customerService.deleteCustomer(customerId);
            
            if (deleted) {
                return ResponseEntity.ok("Customer deleted successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Customer not found")) {
                return ResponseEntity.notFound().build();
            } else {
                return ResponseEntity.status(500).body("Failed to delete customer: " + e.getMessage());
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete customer: " + e.getMessage());
        }
    }
}
