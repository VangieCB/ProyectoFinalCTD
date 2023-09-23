package com.dh.finduback.service.imp;

import com.dh.finduback.entity.Country;
import com.dh.finduback.repository.ICountryRepository;
import com.dh.finduback.service.ICountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CountryService implements ICountryService {
    @Autowired
    private ICountryRepository countryRepository;

    @Override
    public List<Country> findAll() {
        return countryRepository.findAll();
    }
}
