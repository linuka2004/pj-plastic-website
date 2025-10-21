package com.pjplastic.pjplastic_backend.service;

import com.pjplastic.pjplastic_backend.dto.CreateCustomerDto;
import com.pjplastic.pjplastic_backend.dto.UpdateCustomerDto;
import com.pjplastic.pjplastic_backend.entity.CustomerEntity;

import java.util.List;
import java.util.Optional;

public interface CustomerService {

    List<CustomerEntity> getAllCustomers();
    Optional<CustomerEntity> getCustomerById(Integer customerId);
    CustomerEntity createCustomer(CreateCustomerDto createCustomerDto);
    CustomerEntity updateCustomer(Integer customerId, UpdateCustomerDto updateCustomerDto);
    boolean deleteCustomer(Integer customerId);

}
