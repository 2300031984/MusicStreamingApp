package com.spring.online.demo.DAO;


import com.spring.online.demo.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<User, Integer> {
   
    @Query("SELECT COUNT(U) FROM User U WHERE U.email = :email AND U.password = :password")
    int validateCredentials(@Param("email") String email, @Param("password") String password);
    

    @Query("select U from User U where U.email=:email AND U.password=:password")
    public User findByEmailAndPassword(String email, String password);

    @Query("select U from User U where U.email=:email")
    public User findByEmail(String email);

    @Query("Select count(u) from User u where u.email =:email")
    public int validateEmail(@Param("email") String email);





}
