﻿namespace Authentication.Api.Abstractions.Transports.Data.user;

public class Authorizations
{
	public required Authentication Authentication { get; set; }
	public Videyo? Videyo { get; set; }

	public SousMarinJaune? SousMarinJaune { get; set; }
}