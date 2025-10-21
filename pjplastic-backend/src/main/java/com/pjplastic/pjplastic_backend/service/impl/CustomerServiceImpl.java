package com.pjplastic.pjplastic_backend.service.impl;

import com.pjplastic.pjplastic_backend.dto.CreateCustomerDto;
import com.pjplastic.pjplastic_backend.dto.UpdateCustomerDto;
import com.pjplastic.pjplastic_backend.entity.CustomerEntity;
import com.pjplastic.pjplastic_backend.repository.CustomerRepository;
import com.pjplastic.pjplastic_backend.service.CustomerService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public List<CustomerEntity> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Optional<CustomerEntity> getCustomerById(Integer customerId) {
        return customerRepository.findById(customerId);
    }

    @Override
    public CustomerEntity createCustomer(CreateCustomerDto createCustomerDto) {

        CustomerEntity customerEntity = new CustomerEntity();
        customerEntity.setName(createCustomerDto.getName());
        customerEntity.setMobile(createCustomerDto.getMobile());
        customerEntity.setEmail(createCustomerDto.getEmail());
        
        return customerRepository.save(customerEntity);
    }

    @Override
    public CustomerEntity updateCustomer(Integer customerId, UpdateCustomerDto updateCustomerDto) {
        CustomerEntity existing = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + customerId));
        
        if (updateCustomerDto.getName() != null) {
            existing.setName(updateCustomerDto.getName());
        }
        if (updateCustomerDto.getMobile() != null) {
            existing.setMobile(updateCustomerDto.getMobile());
        }
        if (updateCustomerDto.getEmail() != null) {
            existing.setEmail(updateCustomerDto.getEmail());
        }
        
        return customerRepository.save(existing);
    }

    @Override
    public boolean deleteCustomer(Integer customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new RuntimeException("Customer not found with id: " + customerId);
        }
        
        try {
            customerRepository.deleteById(customerId);
            return true;
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete customer with id " + customerId + ": " + e.getMessage(), e);
        }
    }
}
